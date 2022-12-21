import axios from 'axios';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Editor from '../../../../components/editor';
import AdminLayout from '../../../../components/layout/AdminLayout';
import dbConnect from '../../../../lib/dbConnect';
import Post from '../../../../models/Post';
import { generateFormData } from '../../../../utils/helper';
import { FinalPost } from '../../../../utils/types';

interface PostResponse extends FinalPost {
  id: string;
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({ post }) => {
  const handleSubmit = async (post: FinalPost) => {
    try {
      // generate FormData for handle file type upload
      const formData = generateFormData(post);

      // submit post
      const { data } = await axios.patch('/api/posts/' + post.id, formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <AdminLayout title="Update Post">
      <div className="mx-auto max-w-4xl">
        <Editor initialValue={post} onSubmit={handleSubmit} btnTitle="Update" />
      </div>
    </AdminLayout>
  );
};

interface ServerSideResponse {
  post: PostResponse;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async (context) => {
  try {
    const slug = context.query.slug as string;

    await dbConnect();
    const post = await Post.findOne({ slug });
    if (!post) return { notFound: true };

    const { _id, title, content, thumbnail, tags, meta } = post;

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          tags: tags.join(', '),
          thumbnail: thumbnail?.url || '',
          slug,
          meta,
        },
      }, // will be passed to the page component as props
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default Update;
