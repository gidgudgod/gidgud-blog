import axios from 'axios';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useState } from 'react';
import ConfirmModal from '../../../components/common/ConfirmModal';
import InfiniteScrollPosts from '../../../components/common/InfiniteScrollPosts';
import AdminLayout from '../../../components/layout/AdminLayout';
import { formatPosts, readPostsFromDb } from '../../../lib/utils';
import { filterPosts } from '../../../utils/helper';
import { PostDetail } from '../../../utils/types';

let pageNumber = 0;
const limit = 9;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPoststoRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const fetchMorePosts = async () => {
    try {
      pageNumber++;
      const { data } = await axios(
        `/api/posts?limit=${limit}&skip=${postsToRender.length}`
      );

      if (data.posts.length < limit) {
        setPoststoRender([...postsToRender, ...data.posts]);
        setHasMorePosts(false);
      } else {
        setPoststoRender([...postsToRender, ...data.posts]);
      }
    } catch (error) {
      setHasMorePosts(false);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout>
        <InfiniteScrollPosts
          hasMore={hasMorePosts}
          next={fetchMorePosts}
          dataLength={postsToRender.length}
          posts={postsToRender}
          showControls={true}
          onPostRemoved={(post) => {
            setPoststoRender(filterPosts(postsToRender, post));
          }}
        />
      </AdminLayout>
      <ConfirmModal
        // visible
        title="Are you sure?"
        subTitle="This will remove the post permanently"
        // busy
      />
    </>
  );
};

interface ServerSideResponse {
  posts: PostDetail[];
}

//nssp
export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async (ctx) => {
  try {
    const posts = await readPostsFromDb(limit, pageNumber);

    const formattedPosts = formatPosts(posts!);
    return {
      props: {
        posts: formattedPosts,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default Posts;
