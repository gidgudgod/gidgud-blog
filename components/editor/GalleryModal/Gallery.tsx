import { FC } from 'react';
import { BsCardImage } from 'react-icons/bs';
import Image from './Image';

/*images*/

interface Props {
  images: { src: string }[];
  onSelect(src: string): void;
  uploading?: boolean;
  selectedImage?: string;
}

const Gallery: FC<Props> = ({
  images,
  uploading = false,
  selectedImage = '',
  onSelect,
}): JSX.Element => {
  return (
    <div className="flex flex-wrap">
      {uploading && (
        <div className="flex aspect-square basis-[25%] animate-pulse flex-col items-center justify-center rounded bg-secondary-light p-2 text-primary-dark">
          <BsCardImage size={60} />
          <p>Uploading</p>
        </div>
      )}
      {images.map(({ src }, i) => {
        return (
          <div key={i} className="basis-[25%] p-2">
            <Image
              src={src}
              selected={selectedImage === src}
              onClick={() => onSelect(src)}
              alt={`gallery ${i}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
