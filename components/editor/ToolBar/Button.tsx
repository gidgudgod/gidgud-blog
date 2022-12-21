import classNames from 'classnames';
import { FC, MouseEventHandler, ReactNode, useCallback } from 'react';

interface Props {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<Props> = ({
  children,
  active,
  disabled,
  onMouseDown,
  onClick,
}): JSX.Element => {
  const getActiveStyle = useCallback(() => {
    if (active)
      return 'dark:bg-primary-light dark:text-primary-dark bg-primary-dark text-primary-light';
    else return 'text-secondary-light bg-secondary-dark';
  }, [active]);

  const commonClasses =
    'p-2 rounded text-lg hover:scale-110 hover:shadow-md transition';

  return (
    <button
      type="button"
      className={classNames(commonClasses, getActiveStyle())}
      disabled={disabled}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
