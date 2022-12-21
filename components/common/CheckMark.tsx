import { FC } from 'react';
import { BsCheckLg } from 'react-icons/bs';

interface Props {
  visible: boolean;
}

const CheckMark: FC<Props> = ({ visible }): JSX.Element | null => {
  if (!visible) return null;
  return (
    <div className="rounded-full bg-action bg-opacity-70 p-2 text-primary-light backdrop-blur-sm">
      <BsCheckLg />
    </div>
  );
};

export default CheckMark;
