import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import parse from 'html-react-parser';
import Image from 'next/image';
import dateFormat from 'dateformat';
import DefaultLayout from '../components/layout/DefaultLayout';
import dbConnect from '../lib/dbConnect';
import Post from '../models/Post';
import useAuth from '../hooks/useAuth';
import Comments from '../components/common/Comments';
import LikeHeart from '../components/common/LikeHeart';
import { useCallback, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import User from '../models/User';
import AuthorInfo from '../components/common/AuthorInfo';
import Share from '../components/common/Share';
import Link from 'next/link';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const host = 'http://localhost:3000';

const SinglePost: NextPage<Props> = ({ post }) => {
  const {
    id,
    title,
    content,
    meta,
    tags,
    slug,
    thumbnail,
    createdAt,
    author,
    relatedPosts,
  } = post;

  const [likes, setLikes] = useState({ likedByOwner: false, count: 0 });
  const [liking, setLiking] = useState(false);

  const user = useAuth();

  const getLikeLabel = useCallback((): string => {
    const { likedByOwner, count } = likes;

    if (likedByOwner && count === 1) return "You've liked this post.";
    if (likedByOwner) return `You and ${count - 1} other likes this post.`;
    if (count === 0) return 'Like post';
    return count + ' people liked this post.';
  }, [likes]);

  const handleOnLikeClick = async () => {
    setLiking(true);
    try {
      if (!user) return await signIn('github');
      const { data } = await axios.post(`/api/posts/update-like?postId=${id}`);
      setLikes({ likedByOwner: !likes.likedByOwner, count: data.newLikes });
    } catch (error) {
      console.log(error);
    }
    setLiking(false);
  };

  useEffect(() => {
    axios(`/api/posts/like-status?postId=${id}`)
      .then(({ data }) =>
        setLikes({ likedByOwner: data.likedByOwner, count: data.likesCount })
      )
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <DefaultLayout title={title} desc={meta}>
      <div className="px-3 lg:px-0">
        {thumbnail ? (
          <div className="relative aspect-video">
            <Image
              src={thumbnail}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : null}

        <h1 className="py-2 text-6xl font-semibold text-primary-dark dark:text-primary-light">
          {title}
        </h1>

        <div className="flex items-center justify-between py-2 text-secondary-dark dark:text-secondary-light">
          <div>
            {tags.map((t, index) => (
              <span key={t + index}>
                #{t}
                &nbsp;
              </span>
            ))}
          </div>
          <span>{dateFormat(createdAt, 'd-mmm-yyyy')}</span>
        </div>
        <div className="sticky top-0 z-50 bg-primary-light py-5 transition dark:bg-primary-dark">
          <Share url={host + '/' + slug} />
        </div>

        <div className="prose prose-lg mx-auto max-w-full dark:prose-invert">
          {parse(content)}
        </div>

        <div className="py-10">
          <LikeHeart
            liked={likes.likedByOwner}
            label={getLikeLabel()}
            onClick={!liking ? handleOnLikeClick : undefined}
            busy={liking}
          />
        </div>

        <div className="pt-10">
          <AuthorInfo profile={JSON.parse(author)} />
        </div>

        <div className="pt-5">
          <h3 className="mb-4 bg-secondary-dark p-2 text-xl font-semibold text-primary-light">
            Related Posts:
          </h3>

          <div className="flex flex-col space-y-4">
            {relatedPosts.map((p) => {
              return (
                <Link
                  href={p.slug}
                  key={p.id}
                  className="font-semibold text-primary-dark hover:underline dark:text-primary-light"
                >
                  {p.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* comment form */}
        <Comments belongsTo={id} />
      </div>
    </DefaultLayout>
  );
};

export default SinglePost;

// fallback: blocking === if the slug doesn't have a page,
// Next will try to fetch the page from the database
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    await dbConnect();
    const posts = await Post.find().select('slug');
    const paths = posts.map(({ slug }) => ({ params: { slug } }));
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    return {
      paths: [{ params: { slug: '/' } }],
      fallback: false,
    };
  }
};

interface StaticPropsResponse {
  post: {
    id: string;
    title: string;
    content: string;
    meta: string;
    tags: string[];
    slug: string;
    thumbnail: string;
    createdAt: string;
    author: string;
    relatedPosts: {
      id: string;
      title: string;
      slug: string;
    }[];
  };
}

export const getStaticProps: GetStaticProps<
  StaticPropsResponse,
  { slug: string }
> = async ({ params }) => {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params?.slug }).populate('author');
    if (!post) return { notFound: true };

    // fetching related posts according to tags
    const posts = await Post.find({
      tags: { $in: [...post.tags] },
      _id: { $ne: post._id },
    })
      .sort({ createdAt: 'desc' })
      .limit(5)
      .select('slug title');

    const relatedPosts = posts.map(({ _id, title, slug }) => {
      return {
        id: _id.toString(),
        title,
        slug,
      };
    });

    const {
      _id,
      title,
      content,
      meta,
      tags,
      slug,
      thumbnail,
      createdAt,
      author,
    } = post;

    const admin = await User.findOne({ role: 'admin' });
    const authorInfo = (author || admin) as any;
    const postAuthor = {
      id: authorInfo._id,
      name: authorInfo.name,
      avatar: authorInfo.avatar,
      message: `This post is written by ${authorInfo.name}. ${
        authorInfo.name.split(' ')[0]
      }`,
    };
    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          meta,
          tags,
          slug,
          thumbnail: thumbnail?.url || '',
          createdAt: createdAt.toString(),
          author: JSON.stringify(postAuthor),
          relatedPosts,
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
};
