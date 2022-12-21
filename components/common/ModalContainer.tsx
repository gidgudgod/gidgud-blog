import {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from 'react';

interface Props extends ModalProps {
  children: ReactNode;
}

export interface ModalProps {
  visible?: boolean;
  onClose?(): void;
}

const ModalContainer: FC<Props> = ({
  visible,
  children,
  onClose,
}): JSX.Element | null => {
  const containerId = useId();
  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);
  const handleClick: MouseEventHandler<HTMLDivElement> = ({ target }: any) => {
    if (target.id === containerId) handleClose();
  };

  useEffect(() => {
    const closeModal = ({ key }: any) => key === 'Escape' && handleClose();
    document.addEventListener('keydown', closeModal);

    return () => document.removeEventListener('keydown', closeModal);
  }, [handleClose]);

  if (!visible) return null;
  return (
    <div
      id={containerId}
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-light bg-opacity-5 backdrop-blur-[2px] dark:bg-primary-dark dark:bg-opacity-5"
    >
      {children}
    </div>
  );
};

export default ModalContainer;
