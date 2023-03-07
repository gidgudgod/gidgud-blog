import { NextPage } from 'next';
import { GitHubAuthButton } from '../../components/button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const Signin: NextPage<Props> = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-primary-light dark:bg-primary-dark">
      <GitHubAuthButton />
    </div>
  );
};

export default Signin;
