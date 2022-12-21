import { FC, useEffect, useState } from 'react';
import { validateUrl } from '../editorUtils';

interface Props {
  visible: boolean;
  initialState?: linkOption;
  onSubmit(link: linkOption): void;
  onRemove?(): void;
}

export type linkOption = {
  url: string;
  openInNewTab: boolean;
};

const LinkForm: FC<Props> = ({
  visible,
  initialState,
  onRemove,
  onSubmit,
}): JSX.Element | null => {
  const [link, setLink] = useState<linkOption>(
    initialState ? initialState : { url: '', openInNewTab: false }
  );
  // const [url, setUrl] = useState(initialState?.url);
  // const [openInNewTab, setOpenInNewTab] = useState(initialState?.openInNewTab);

  const handleSubmit = () => {
    onSubmit({ ...link, url: validateUrl(link.url) });
    resetForm();
  };

  const resetForm = () => {
    setLink({ url: '', openInNewTab: false });
  };

  useEffect(() => {
    if (initialState) setLink({ ...initialState });
  }, [initialState]);

  if (!visible) return null;

  return (
    <div className="animate-reveal z-50 rounded bg-primary-light p-2 text-left shadow-md dark:bg-primary-dark dark:shadow-secondary-dark">
      <div className="flex items-center space-x-2">
        <input
          autoFocus
          type="text"
          className="rounded border-2 border-secondary-dark bg-transparent p-2 text-primary-dark transition focus:border-primary-dark focus:ring-0 dark:text-primary-light dark:focus:border-primary-light"
          placeholder="https://example.com"
          value={link.url}
          onChange={({ target }) => setLink({ ...link, url: target.value })}
        />
      </div>

      <div className="mt-2 flex select-none items-center space-x-1 text-sm text-secondary-dark dark:text-secondary-light">
        <input
          type="checkbox"
          id="checkbox"
          checked={link.openInNewTab}
          onChange={({ target }) =>
            setLink({ ...link, openInNewTab: target.checked })
          }
          className="h-3 w-3 rounded-sm outline-none focus:ring-0"
        />
        <label htmlFor="checkbox">open in new tab</label>

        <div className="flex-1 text-right">
          <button
            onClick={handleSubmit}
            className="rounded bg-action px-2 py-1 text-sm text-primary-light"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkForm;
