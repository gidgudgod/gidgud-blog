import { FC, ReactNode, useState } from 'react';

export type dropdownOptions = { label: string; onClick(): void }[];

interface Props {
  options: { label: string; onClick(): void }[];
  head: ReactNode;
}

const DropdownOptions: FC<Props> = ({ head, options }): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <button
      onBlur={() => setShowOptions(false)}
      onMouseDown={() => setShowOptions(!showOptions)}
      className="relative"
    >
      {head}
      {showOptions && (
        <div className="absolute top-full right-2 z-40 mt-4 min-w-max rounded border-2 border-primary-dark bg-primary-light text-left dark:border-primary-light dark:bg-primary-dark">
          <ul className="space-y-3 p-3 text-primary-dark dark:text-primary-light">
            {options.map(({ label, onClick }, i) => {
              return (
                <li key={label + i} onMouseDown={onClick}>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </button>
  );
};

export default DropdownOptions;
