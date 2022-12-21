import { FC, ReactNode } from 'react';
import AppHead from '../common/AppHead';
import UserNav from '../common/nav/UserNav';

interface Props {
  title?: string;
  desc?: string;
  children?: ReactNode;
}

const DefaultLayout: FC<Props> = ({ children, title, desc }): JSX.Element => {
  return (
    <>
      <AppHead title={title} desc={desc} />
      <div className="min-h-screen bg-primary-light transition dark:bg-primary-dark">
        <UserNav />

        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </>
  );
};

export default DefaultLayout;
