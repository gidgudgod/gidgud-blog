import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useState } from 'react';
import InfiniteScrollPosts from '../components/common/InfiniteScrollPosts';
import DefaultLayout from '../components/layout/DefaultLayout';
import useAuth from '../hooks/useAuth';
import { formatPosts, readPostsFromDb } from '../lib/utils';
import { filterPosts } from '../utils/helper';
import { PostDetail } from '../utils/types';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

let pageNumber = 0;
const limit = 9;

const Home: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPoststoRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const profile = useAuth();
  const isAdmin = profile && profile.role === 'admin';

  const fetchMorePosts = async () => {
    try {
      pageNumber++;
      const { data } = await axios(`/api/posts?limit=${limit}&skip=${postsToRender.length}`);

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
    <DefaultLayout>
      <div className="pb-20">
        <InfiniteScrollPosts
          hasMore={hasMorePosts}
          next={fetchMorePosts}
          dataLength={postsToRender.length}
          posts={postsToRender}
          showControls={isAdmin}
          onPostRemoved={(post) => {
            setPoststoRender(filterPosts(postsToRender, post));
          }}
        ></InfiniteScrollPosts>
      </div>
    </DefaultLayout>
  );
};

export default Home;

interface ServerSideResponse {
  posts: PostDetail[];
}

//nssp
export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async (ctx) => {
  try {
    const posts = await readPostsFromDb(limit, pageNumber);

    if (!posts) return { notFound: true };
    const formattedPosts = formatPosts(posts);
    return {
      props: {
        posts: formattedPosts,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
