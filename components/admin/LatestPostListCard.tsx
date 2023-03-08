import Link from 'next/link';
import { FC } from 'react';
import { trimText } from '../../utils/helper';

interface Props {
  title: string;
  meta: string;
  slug: string;
  onDeleteClick?(): void;
}

const LatestPostListCard: FC<Props> = ({
  title,
  slug,
  meta,
  onDeleteClick,
}): JSX.Element => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-primary-dark transition dark:text-primary-light">
        {trimText(title, 50)}
      </h1>
      <p className="text-sm text-secondary-dark">{trimText(meta, 100)}</p>

      <div className="flex items-center justify-end space-x-3">
        <Link
          href={'/admin/posts/update/' + slug}
          className="text-primary-dark transition hover:underline dark:text-primary-light"
        >
          Edit
        </Link>

        <button
          onClick={onDeleteClick}
          className="text-primary-dark transition hover:underline dark:text-primary-light"
        >
          Delete
        </button>
      </div>

      <hr className="mt-2" />
    </div>
  );
};

export default LatestPostListCard;
