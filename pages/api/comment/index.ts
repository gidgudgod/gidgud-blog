import { isValidObjectId } from 'mongoose';
import { NextApiHandler } from 'next';
import dbConnect from '../../../lib/dbConnect';
import { formatComment, isAuth } from '../../../lib/utils';
import {
  commentValidationSchema,
  validateSchema,
} from '../../../lib/validator';
import Comment from '../../../models/Comment';
import Post from '../../../models/Post';
import { CommentResponse } from '../../../utils/types';

const handler: NextApiHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      return readComments(req, res);
    case 'POST':
      return createNewComment(req, res);
    case 'PATCH':
      return updateComment(req, res);
    case 'DELETE':
      return removeComment(req, res);
    default:
      res.status(404).send('Not found');
  }
};

const readComments: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);

  const { belongsTo } = req.query;
  if (!belongsTo || !isValidObjectId(belongsTo))
    return res.status(422).json({ error: 'Invalid request' });

  const comments = await Comment.find({ belongsTo })
    .populate({
      path: 'owner',
      select: 'name avatar',
    })
    .populate({
      path: 'replies',
      populate: {
        path: 'owner',
        select: 'name avatar',
      },
    });

  if (!comments) return res.json({ comment: comments });
  const formmatedComment: CommentResponse[] = comments.map((comment) => {
    return {
      ...formatComment(comment, user),
      replies: comment.replies?.map((c: any) => formatComment(c, user)),
    };
  });
  res.json({ comments: formmatedComment });
};

const createNewComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);
  if (!user) return res.status(403).json({ error: 'unauthenticated request' });

  const error = validateSchema(commentValidationSchema, req.body);
  if (error) return res.status(422).json({ error });

  // create comment
  await dbConnect();
  const { belongsTo, content } = req.body;

  const post = await Post.findById(belongsTo);
  if (!post) return res.status(404).json({ error: 'Invalid Post' });

  const comment = new Comment({
    content,
    belongsTo,
    owner: user.id,
    chiefComment: true,
  });

  await comment.save();
  const commentWithOwner = await comment.populate('owner');

  res.status(201).json({ comment: formatComment(commentWithOwner, user) });
};

const updateComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);
  if (!user) return res.status(403).json({ error: 'unauthenticated request' });

  const error = validateSchema(commentValidationSchema, req.body);
  if (error) return res.status(422).json({ error });

  const { commentId } = req.query;
  if (!commentId || !isValidObjectId(commentId))
    return res.status(422).json({ error: 'Invalid request' });

  const comment = await Comment.findOne({
    _id: commentId,
    owner: user.id,
  }).populate('owner');
  if (!comment)
    return res
      .status(404)
      .json({ error: 'Comment not found/Unauthorized user' });

  comment.content = req.body.content;
  await comment.save();

  res.json({ comment: formatComment(comment) });
};

const removeComment: NextApiHandler = async (req, res) => {
  const user = await isAuth(req, res);
  if (!user) return res.status(403).json({ error: 'unauthenticated request' });

  const { commentId } = req.query;
  if (!commentId || !isValidObjectId(commentId))
    return res.status(422).json({ error: 'Invalid request' });

  const comment = await Comment.findOne({ _id: commentId, owner: user.id });
  if (!comment)
    return res
      .status(404)
      .json({ error: 'Comment not found/Unauthorized user' });

  // if this is a chief comment, remove other related comments(replies) as well
  if (comment.chiefComment) await Comment.deleteMany({ repliedTo: commentId });
  else {
    // if this is the reply comment(not chief comment), remove from the chiefComment replies
    const chiefComment = await Comment.findById(comment.repliedTo);
    if (chiefComment?.replies?.includes(commentId as any)) {
      chiefComment.replies = chiefComment.replies.filter(
        (cId) => cId.toString() !== commentId.toString()
      );

      await chiefComment.save();
    }
  }

  //lastly remove the actual comment
  await Comment.findByIdAndDelete(commentId);
  res.json({ removed: true });
};

export default handler;
