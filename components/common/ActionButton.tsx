import { FC, MouseEventHandler } from 'react';
import { BiLoader } from 'react-icons/bi';

interface Props {
  title: string;
  busy?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton: FC<Props> = ({
  disabled,
  busy = false,
  title,
  onClick,
}): JSX.Element => {
  return (
    <button
      className="flex w-full items-center justify-center space-x-2 rounded bg-action px-6 py-2 font-semibold text-highlight-dark transition duration-100 hover:scale-[0.97]"
      onClick={onClick}
      disabled={disabled}
    >
      <span>{title}</span>
      {busy && <BiLoader className="animate-spin" size={20} />}
    </button>
  );
};

export default ActionButton;
