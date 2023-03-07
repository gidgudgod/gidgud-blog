import { FC } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

interface Props {
  busy?: boolean;
  label?: string;
  liked?: boolean;
  onClick?(): void;
}

const LikeHeart: FC<Props> = ({
  liked = false,
  label,
  onClick,
}): JSX.Element => {
  return (
    <button
      type="button"
      className="flex items-center space-x-2 text-primary-dark outline-none dark:text-primary-light"
      onClick={onClick}
    >
      {liked ? <BsHeartFill color="#4790FD" /> : <BsHeart />}
      <span>{label}</span>
    </button>
  );
};

export default LikeHeart;
