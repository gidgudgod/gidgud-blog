import axios from 'axios';
import { NextPage } from 'next';
import Editor from '../../../../components/editor';
import AdminLayout from '../../../../components/layout/AdminLayout';
import { generateFormData } from '../../../../utils/helper';
import { FinalPost } from '../../../../utils/types';

interface Props {}

const Create: NextPage<Props> = () => {
  const handleSubmit = async (post: FinalPost) => {
    try {
      // generate FormData for handle file type upload
      const formData = generateFormData(post);

      // submit post
      const { data } = await axios.post('/api/posts', formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <AdminLayout title="New Post">
      <div className="mx-auto max-w-4xl">
        <Editor
          onSubmit={handleSubmit}
          // initialValue={{
          //   title: 'Tititle',
          //   content: 'asdasdsadasdas',
          //   thumbnail:
          //     'https://res.cloudinary.com/gidgud/image/upload/v1669896354/gidgud-blog/naeg3zqjiynqiq1roeu6.png',
          //   meta: 'metaaa',
          //   slug: 'slugg',
          //   tags: 'asdasd',
          // }}
        />
      </div>
    </AdminLayout>
  );
};

export default Create;
