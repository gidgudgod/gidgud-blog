import { FC } from 'react';

interface Props {}

const SearchBar: FC<Props> = (props): JSX.Element => {
  return (
    <input
      placeholder="Search..."
      type="text"
      className="rounded border-2 border-secondary-dark bg-transparent p-2 text-primary-dark outline-none transition focus:border-primary-dark dark:text-primary-light dark:focus:border-primary-light"
    />
  );
};

export default SearchBar;
