import Image from 'next/image';
import { FC } from 'react';
import { PostDetail } from '../../utils/types';
import dateformat from 'dateformat';
import Link from 'next/link';

interface Props {
  post: PostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + '...';
};

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  const { title, slug, meta, tags, thumbnail, createdAt } = post;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-primary-light shadow-sm shadow-secondary-dark transition dark:bg-primary-dark">
      {/* thumbnail */}
      <div className="relative aspect-video">
        {!thumbnail ? (
          <div className="flex h-full w-full items-center justify-center font-semibold text-secondary-dark opacity-50">
            No Image
          </div>
        ) : (
          <Image
            src={thumbnail}
            fill
            style={{ objectFit: 'cover' }}
            alt="thumbnail"
          />
        )}
      </div>

      {/* post info */}
      <div className="flex flex-1 flex-col p-2">
        <Link href={'/' + slug}>
          <div className="flex items-center justify-between text-sm text-primary-dark dark:text-primary-light">
            <div className="flex items-center space-x-1">
              {tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
            <span>{dateformat(createdAt, 'd-mmm-yyyy')}</span>
          </div>

          <h1 className="font-semibold text-primary-dark dark:text-primary-light">
            {trimText(title, 50)}
          </h1>
          <p className="text-secondary-dark">{trimText(meta, 70)}</p>
        </Link>

        {controls && (
          <div className="mt-auto flex h-8 items-center justify-end space-x-4 text-primary-dark dark:text-primary-light">
            {busy ? (
              <span className="animate-pulse">Removing</span>
            ) : (
              <>
                <Link
                  href={'/admin/posts/update/' + slug}
                  className="hover:underline"
                >
                  Edit
                </Link>
                <button onClick={onDeleteClick} className="hover:underline">
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
