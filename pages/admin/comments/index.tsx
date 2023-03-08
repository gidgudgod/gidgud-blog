import { NextPage } from 'next';
import Comments from '../../../components/common/Comments';
import AdminLayout from '../../../components/layout/AdminLayout';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const AdminComments: NextPage<Props> = () => {
  return (
    <AdminLayout>
      <h1 className="py-2 text-2xl font-semibold text-primary-dark transition dark:text-primary-light">
        Comments
      </h1>
      <div className="mx-auto max-w-4xl">
        <Comments fetchAll />
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
