import Link from 'next/link';
import { FC, ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  seeAllRoute: string;
}

const ContentWrapper: FC<Props> = ({
  title,
  seeAllRoute,
  children,
}): JSX.Element => {
  return (
    <div className="flex min-w-[300px] flex-col">
      <h3 className="py-2 text-2xl font-semibold text-primary-dark transition dark:text-primary-light">
        {title}
      </h3>

      <div className="flex flex-1 flex-col justify-between rounded border-2 border-secondary-dark p-3">
        <div className="space-y-5">{children}</div>

        <div className="mt-2 self-end text-right">
          <Link
            href={seeAllRoute}
            className="text-primary-dark transition hover:underline dark:text-primary-light"
          >
            See all
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContentWrapper;
