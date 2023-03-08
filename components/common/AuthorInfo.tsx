import Image from 'next/image';
import { FC } from 'react';

export interface AuthorProfile {
  id: string;
  name: string;
  avatar: string;
  message: string;
}

interface Props {
  profile: AuthorProfile;
}

const AuthorInfo: FC<Props> = ({ profile }): JSX.Element => {
  const { name, message, avatar } = profile;
  return (
    <div className="flex rounded border-2 border-secondary-dark p-2">
      {/* profile icons */}
      <div className="w-12">
        <div className="relative aspect-square">
          <Image src={avatar} fill alt={name} className="rounded" />
        </div>
      </div>
      {/* profile name, message */}
      <div className="ml-2 flex-1">
        <h4 className="font-semibold text-primary-dark dark:text-primary-light">
          {name}
        </h4>
        <p className=" text-primary-dark opacity-90 dark:text-primary-light">
          {message}
        </p>
      </div>
    </div>
  );
};

export default AuthorInfo;
