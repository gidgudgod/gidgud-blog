import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { AiFillGithub } from 'react-icons/ai';

interface Props {
  lightOnly?: boolean;
  onClick?(): void;
}

const commonClasses =
  'flex items-center justify-center space-x-1 rounded  px-3 py-2  transition duration-100 hover:scale-[0.97]';

export const GitHubAuthButton: FC<Props> = ({
  lightOnly,
  onClick,
}): JSX.Element => {
  const getStyle = useCallback(() => {
    if (lightOnly) return 'text-primary-dark bg-primary-light';

    return 'bg-primary-dark dark:bg-primary-light dark:text-primary-dark text-primary-light';
  }, [lightOnly]);
  return (
    <button onClick={onClick} className={classNames(commonClasses, getStyle())}>
      <span>Continue with</span>
      <AiFillGithub size={24} />
    </button>
  );
};

export default GitHubAuthButton;
