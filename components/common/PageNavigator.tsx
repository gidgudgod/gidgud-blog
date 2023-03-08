import { FC, MouseEventHandler } from 'react';

interface Props {
  onPrevClick?(): void;
  onNextClick?(): void;
}

const PageNavigator: FC<Props> = ({
  onPrevClick,
  onNextClick,
}): JSX.Element => {
  return (
    <div className="flex items-center space-x-3">
      <Button onClick={onPrevClick} title="Prev"></Button>
      <Button onClick={onNextClick} title="Next"></Button>
    </div>
  );
};

const Button: FC<{ title: string; onClick?: MouseEventHandler }> = ({
  title,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-primary-dark transition hover:underline dark:text-primary-light"
    >
      {title}
    </button>
  );
};

export default PageNavigator;
