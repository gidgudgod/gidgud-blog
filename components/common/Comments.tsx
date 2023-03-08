import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { CommentResponse } from '../../utils/types';
import GitHubAuthButton from '../button/GitHubAuthButton';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import ConfirmModal from './ConfirmModal';
import PageNavigator from './PageNavigator';

interface Props {
  belongsTo?: string;
  fetchAll?: boolean;
}

const limit = 5;
let currentPageNo = 0;

const Comments: FC<Props> = ({ belongsTo, fetchAll }): JSX.Element => {
  const [comments, setComments] = useState<CommentResponse[]>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busyCommentLike, setBusyCommentLike] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedComment, setSelectedComment] =
    useState<CommentResponse | null>(null);
  const [commentToDelete, setCommentToDelete] =
    useState<CommentResponse | null>(null);
  const userProfile = useAuth();

  const insertNewReplyComments = (reply: CommentResponse) => {
    if (!comments) return;
    const updatedComments = [...comments];

    const chiefCommentIndex = updatedComments.findIndex(
      ({ id }) => id === reply.repliedTo
    );
    const { replies } = updatedComments[chiefCommentIndex];
    if (replies) {
      updatedComments[chiefCommentIndex].replies = [...replies, reply];
    } else {
      updatedComments[chiefCommentIndex].replies = [reply];
    }

    setComments([...updatedComments]);
  };

  const updateEditedComment = (newComment: CommentResponse) => {
    if (!comments) return;

    const updatedComments = [...comments];

    if (newComment.chiefComment) {
      const index = updatedComments.findIndex(({ id }) => id === newComment.id);
      updatedComments[index].content = newComment.content;
    } else {
      const chiefCommentIndex = updatedComments.findIndex(
        ({ id }) => id === newComment.repliedTo
      );

      let { replies: newReplies } = updatedComments[chiefCommentIndex];
      newReplies = newReplies?.map((comment) => {
        if (comment.id === newComment.id) comment.content = newComment.content;
        return comment;
      });

      updatedComments[chiefCommentIndex].replies = newReplies;
    }

    setComments([...updatedComments]);
  };

  const updateDeletedComments = (deletedComment: CommentResponse) => {
    if (!comments) return;
    let newComments = [...comments];

    if (deletedComment.chiefComment) {
      newComments = newComments.filter(({ id }) => id !== deletedComment.id);
    } else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === deletedComment.repliedTo
      );
      const newReplies = newComments[chiefCommentIndex].replies?.filter(
        ({ id }) => id !== deletedComment.id
      );
      newComments[chiefCommentIndex].replies = newReplies;
    }

    setComments([...newComments]);
  };

  const updateLikedComments = (likedComment: CommentResponse) => {
    if (!comments) return;
    let newComments = [...comments];

    if (likedComment.chiefComment) {
      newComments = newComments.map((comment) => {
        if (comment.id === likedComment.id) return likedComment;
        return comment;
      });
    } else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === likedComment.repliedTo
      );
      const newReplies = newComments[chiefCommentIndex].replies?.map(
        (reply) => {
          if (reply.id === likedComment.id) return likedComment;
          return reply;
        }
      );
      newComments[chiefCommentIndex].replies = newReplies;
    }

    setComments([...newComments]);
  };

  const handleNewCommentSubmit = async (content: string) => {
    setSubmitting(true);
    try {
      const newComment = await axios
        .post('/api/comment', { content, belongsTo })
        .then(({ data }) => data.comment)
        .catch((err) => console.log(err));
      if (newComment && comments) setComments([...comments, newComment]);
      else setComments([newComment]);
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };

  const handleReplySubmit = (replyComment: {
    content: string;
    repliedTo: string;
  }) => {
    axios
      .post('/api/comment/add-reply', replyComment)
      .then(({ data }) => {
        insertNewReplyComments(data.comment);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateSubmit = (content: string, id: string) => {
    axios
      .patch(`/api/comment/?commentId=${id}`, { content })
      .then(({ data }) => {
        updateEditedComment(data.comment);
      })
      .catch((err) => console.log(err));
  };

  const handleOnDeleteClick = (comment: CommentResponse) => {
    setCommentToDelete(comment);
    setShowConfirmModal(true);
  };
  const handleOnDeleteCancel = () => {
    setCommentToDelete(null);
    setShowConfirmModal(false);
  };
  const handleOnDeleteConfirm = () => {
    if (!commentToDelete) return;
    axios
      .delete(`/api/comment?commentId=${commentToDelete?.id}`)
      .then(({ data }) => {
        if (data.removed) updateDeletedComments(commentToDelete);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setCommentToDelete(null);
        setShowConfirmModal(false);
      });
  };

  const handleOnLikeClick = (comment: CommentResponse) => {
    setBusyCommentLike(true);
    setSelectedComment(comment);
    axios
      .post('/api/comment/update-like', { commentId: comment.id })
      .then(({ data }) => {
        updateLikedComments(data.comment);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setBusyCommentLike(false);
        setSelectedComment(null);
      });
  };

  // fetching all comments
  const fetchAllComments = async (pageNo: number = currentPageNo) => {
    try {
      const { data } = await axios(
        `/api/comment/all?pageNo=${pageNo}&limit=${limit}`
      );

      if (!data.comments.length) {
        currentPageNo--;
        return setReachedToEnd(true);
      }

      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo++;
    fetchAllComments(currentPageNo);
  };
  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo--;
    fetchAllComments(currentPageNo);
  };

  useEffect(() => {
    if (!belongsTo) return;
    axios(`/api/comment?belongsTo=${belongsTo}`)
      .then(({ data }) => {
        setComments(data.comments);
      })
      .catch((err) => console.log(err));
  }, [belongsTo]);

  useEffect(() => {
    if (!belongsTo && fetchAll) {
      fetchAllComments();
    }
  }, [belongsTo, fetchAll]);

  return (
    <div className="space-y-4 py-20">
      {userProfile ? (
        <CommentForm
          visible={!fetchAll}
          onSubmit={handleNewCommentSubmit}
          title="Add comment"
          busy={submitting}
        />
      ) : (
        <div className="flex flex-col items-end space-y-2">
          <h3 className="text-xl font-semibold text-secondary-dark dark:text-secondary-light">
            Log in to add comment
          </h3>
          <GitHubAuthButton />
        </div>
      )}

      {comments?.map((comment) => {
        const { replies } = comment;
        return (
          <div key={comment.id}>
            <CommentCard
              comment={comment}
              showControls={userProfile?.id === comment.owner.id}
              onReplySubmit={(content) =>
                handleReplySubmit({ content, repliedTo: comment.id })
              }
              onUpdateSubmit={(content) =>
                handleUpdateSubmit(content, comment.id)
              }
              onDeleteClick={() => handleOnDeleteClick(comment)}
              onLikeClick={() => handleOnLikeClick(comment)}
              busy={selectedComment?.id === comment.id && busyCommentLike}
            />

            {replies?.length ? (
              <div className="ml-auto w-[93%] space-y-3">
                <h1 className="mb-3 text-secondary-dark">Replies</h1>
                {replies.map((reply) => {
                  return (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      showControls={userProfile?.id === comment.owner.id}
                      onReplySubmit={(content) =>
                        handleReplySubmit({ content, repliedTo: comment.id })
                      }
                      onUpdateSubmit={(content) =>
                        handleUpdateSubmit(content, reply.id)
                      }
                      onDeleteClick={() => handleOnDeleteClick(reply)}
                      onLikeClick={() => handleOnLikeClick(reply)}
                      busy={selectedComment?.id === reply.id && busyCommentLike}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}

      {fetchAll ? (
        <div className="flex justify-end py-10">
          <PageNavigator
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        </div>
      ) : null}

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        subTitle="This action will remove this comment and replies if this is chief comment!"
        onCancel={handleOnDeleteCancel}
        onConfirm={handleOnDeleteConfirm}
      />
    </div>
  );
};

export default Comments;
