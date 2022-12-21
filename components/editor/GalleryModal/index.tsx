import Image from 'next/image';
import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ActionButton from '../../common/ActionButton';
import ModalContainer, { ModalProps } from '../../common/ModalContainer';
import Gallery from './Gallery';

export interface ImageSelectionResult {
  src: string;
  altText: string;
}

interface Props extends ModalProps {
  images: { src: string }[];
  uploading?: boolean;
  onFileSelect(image: File): void;
  onSelect(result: ImageSelectionResult): void;
}

const GalleryModal: FC<Props> = ({
  images,
  uploading,
  visible,
  onFileSelect,
  onSelect,
  onClose,
}): JSX.Element => {
  const [selectedImage, setSelectedImage] = useState('');
  const [altText, setAltText] = useState('');

  const handleClose = useCallback(() => onClose && onClose(), [onClose]);

  const handleOnImageChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files } = target;
    if (!files) return;

    const file = files[0];
    if (!file.type.startsWith('image')) return onClose && onClose();

    onFileSelect(file);
  };

  const handleSelection = () => {
    if (!selectedImage) return handleClose();

    onSelect({ src: selectedImage, altText: altText });
    handleClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="max-w-4xl rounded bg-primary-dark p-2 dark:bg-primary-light">
        <div className="flex">
          {/* gallery */}
          <div className="custom-scroll-bar max-h-[450px] basis-[75%] overflow-auto">
            <Gallery
              images={images}
              onSelect={(src) => setSelectedImage(src)}
              selectedImage={selectedImage}
              uploading={uploading}
            />
          </div>

          {/* image selection and upload */}
          <div className="basis-[25%] px-2">
            <div className="space-y-4">
              <input
                hidden
                type="file"
                id="image-input"
                onChange={handleOnImageChange}
              />
              <label htmlFor="image-input">
                <div className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded border-2 border-action p-2 text-action">
                  <AiOutlineCloudUpload />
                  <span>Upload Image</span>
                </div>
              </label>

              {selectedImage ? (
                <>
                  <textarea
                    className="h-32 w-full resize-none rounded border-2 border-secondary-dark bg-transparent p-1 text-primary-light focus:ring-1 dark:text-primary-dark"
                    placeholder="Alt text"
                    value={altText}
                    onChange={({ target }) => setAltText(target.value)}
                  ></textarea>

                  <ActionButton onClick={handleSelection} title="Select" />

                  <div className="relative aspect-video bg-png-pattern">
                    <Image
                      src={selectedImage}
                      fill
                      alt="selected-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default GalleryModal;
