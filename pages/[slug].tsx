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

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePost: NextPage<Props> = ({ post }) => {
  const userProfile = useAuth();

  const { id, title, content, meta, tags, slug, thumbnail, createdAt } = post;
  return (
    <DefaultLayout title={title} desc={meta}>
      <div>
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
        <div className="prose prose-lg mx-auto max-w-full dark:prose-invert">
          {parse(content)}
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
  };
}

export const getStaticProps: GetStaticProps<
  StaticPropsResponse,
  { slug: string }
> = async ({ params }) => {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug: params?.slug });
    if (!post) return { notFound: true };

    const { _id, title, content, meta, tags, slug, thumbnail, createdAt } =
      post;
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
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
};
