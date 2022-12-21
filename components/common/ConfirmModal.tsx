import classNames from 'classnames';
import { FC } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import ModalContainer, { ModalProps } from './ModalContainer';

interface Props extends ModalProps {
  title: string;
  subTitle: string;
  busy?: boolean;
  onCancel?(): void;
  onConfirm?(): void;
}

const commonBtnClasses = 'rounded px-3 py-1 text-white';

const ConfirmModal: FC<Props> = ({
  visible,
  onClose,
  title,
  subTitle,
  busy = false,
  onCancel,
  onConfirm,
}): JSX.Element => {
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="rounded bg-primary-dark p-3 dark:bg-primary-light">
        {/* title */}
        <p className="text-lg font-semibold text-primary-light dark:text-primary-dark">
          {title}
        </p>
        {/* sub title */}
        <p className="text-primary-light dark:text-primary-dark">{subTitle}</p>
        {/* buttons */}
        {busy && (
          <p className="mt-2 flex items-center space-x-2 text-primary-light dark:text-primary-dark">
            <ImSpinner3 className="animate-spin" /> <span>Please wait</span>{' '}
          </p>
        )}
        {!busy && (
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={onConfirm}
              className={classNames(commonBtnClasses, 'bg-red-500')}
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className={classNames(
                commonBtnClasses,
                'border border-gray-500 text-primary-light dark:text-primary-dark'
              )}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </ModalContainer>
  );
};

export default ConfirmModal;
