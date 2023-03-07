import { FC, useState } from 'react';
import { BsYoutube } from 'react-icons/bs';
import Button from '../ToolBar/Button';

interface Props {
  onSubmit(link: string): void;
}

const EmbedYoutube: FC<Props> = ({ onSubmit }): JSX.Element => {
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return hideForm();

    onSubmit(url);
    setUrl('');
    hideForm();
  };

  const hideForm = () => setVisible(false);
  const showForm = () => setVisible(true);

  return (
    <div
      onKeyDown={({ key }) => {
        if (key === 'Escape') hideForm();
      }}
      className="relative"
    >
      <Button onClick={visible ? hideForm : showForm}>
        <BsYoutube />
      </Button>
      {visible && (
        <div className="absolute top-full right-0 z-50 mt-4">
          <div className="flex items-center space-x-2">
            <input
              autoFocus
              type="text"
              className="rounded border-2 border-secondary-dark 
              bg-transparent p-2 text-primary-dark transition
               focus:border-primary-dark focus:ring-0 dark:text-primary-light dark:focus:border-primary-light"
              placeholder="https://youtube.com"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
            <button
              onClick={handleSubmit}
              className="rounded bg-action p-2 text-sm text-primary-light"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedYoutube;
