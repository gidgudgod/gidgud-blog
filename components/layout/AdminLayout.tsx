import { FC, ReactNode } from 'react';
import AdminNav from '../common/nav/AdminNav';
import { MdSpaceDashboard } from 'react-icons/md';
import { AiFillContainer, AiFillFileAdd } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaComments } from 'react-icons/fa';
import Link from 'next/link';
import AppHead from '../common/AppHead';
import AdminSecondaryNav from '../common/nav/AdminSecondaryNav';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: MdSpaceDashboard },
  { label: 'Posts', href: '/admin/posts', icon: AiFillContainer },
  { label: 'Users', href: '/admin/users', icon: BsFillPeopleFill },
  { label: 'Comments', href: '/admin/comments', icon: FaComments },
];

interface Props {
  title?: string;
  children: ReactNode;
}

const AdminLayout: FC<Props> = ({ title, children }): JSX.Element => {
  return (
    <>
      <AppHead title={title} />
      <div className="flex">
        <AdminNav navItems={navItems} />
        <div className="flex-1 bg-primary-light p-4 dark:bg-primary-dark">
          <AdminSecondaryNav />
          {children}
        </div>
        {/* button create  */}
        <Link
          href="/admin/posts/create"
          className="fixed right-10 bottom-10 z-10 rounded-full
           bg-secondary-dark p-3 text-primary-light shadow-sm
            transition hover:scale-90 dark:bg-secondary-light dark:text-primary-dark"
        >
          <AiFillFileAdd size={24} />
        </Link>
      </div>
    </>
  );
};

export default AdminLayout;
