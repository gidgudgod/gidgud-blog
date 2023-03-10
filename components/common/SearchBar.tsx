import { FC, FormEventHandler, useState } from 'react';

interface Props {
  onSubmit(query: string): void;
}

const SearchBar: FC<Props> = ({ onSubmit }): JSX.Element => {
  const [query, setQuery] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search..."
        type="text"
        className="rounded border-2 border-secondary-dark bg-transparent p-2 text-primary-dark outline-none transition
         focus:border-primary-dark dark:text-primary-light dark:focus:border-primary-light"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
    </form>
  );
};

export default SearchBar;
