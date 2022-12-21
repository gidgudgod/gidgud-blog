import { FC } from 'react';
import NextImage from 'next/image';
import CheckMark from '../../common/CheckMark';

interface Props {
  src: string;
  selected?: boolean;
  onClick?(): void;
  alt?: string;
}

const Image: FC<Props> = ({ src, onClick, selected, alt }): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className="relative h-48 w-48 cursor-pointer overflow-hidden rounded "
    >
      <NextImage
        src={src}
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        fill
        alt={alt || 'image'}
        className="bg-secondary-light object-cover transition hover:scale-110"
      />
      <div className="absolute top-2 left-2">
        <CheckMark visible={selected ?? false} />
      </div>
    </div>
  );
};

export default Image;
