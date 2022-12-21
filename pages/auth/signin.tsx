import { NextPage } from 'next';
import { GitHubAuthButton } from '../../components/button';

interface Props {}

const Signin: NextPage<Props> = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-primary-light dark:bg-primary-dark">
      <GitHubAuthButton />
    </div>
  );
};

export default Signin;
