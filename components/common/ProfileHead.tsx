import classNames from 'classnames';
import Image from 'next/image';
import { FC, useCallback } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import ProfileIcon from './ProfileIcon';

interface Props {
  lightOnly?: boolean;
  avatar?: string;
  nameInitial?: string;
}

const ProfileHead: FC<Props> = ({
  nameInitial,
  avatar,
  lightOnly,
}): JSX.Element => {
  return (
    <div className="flex items-center">
      {/* image / name initial */}
      <ProfileIcon avatar={avatar} nameInitial={nameInitial} lightOnly />
      {/* down icon */}
      <AiFillCaretDown
        className={
          lightOnly
            ? 'text-primary-light'
            : 'text-primary-dark dark:text-primary-light'
        }
      />
    </div>
  );
};

export default ProfileHead;
