import classNames from 'classnames';
import Image from 'next/image';
import { FC, useCallback } from 'react';

interface Props {
  lightOnly?: boolean;
  avatar?: string;
  nameInitial?: string;
}

const commonClasses =
  'relative flex items-center justify-center overflow-hidden rounded-full w-8 h-8 select-none';

const ProfileIcon: FC<Props> = ({
  lightOnly,
  avatar,
  nameInitial,
}): JSX.Element => {
  const getStyle = useCallback(() => {
    if (lightOnly) return 'text-primary-dark bg-primary-light';

    return 'bg-primary-dark dark:bg-primary-light dark:text-primary-dark text-primary-light';
  }, [lightOnly]);
  return (
    <div className={classNames(commonClasses, getStyle())}>
      {avatar ? <Image src={avatar} fill alt="avatar" /> : nameInitial}
    </div>
  );
};

export default ProfileIcon;
