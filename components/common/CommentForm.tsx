import { EditorContent } from '@tiptap/react';
import { FC, useEffect } from 'react';
import useEditorConfig from '../../hooks/useEditorConfig';
import ActionButton from './ActionButton';

interface Props {
  title?: string;
  onSubmit(content: string): void;
  busy?: boolean;
  onClose?(): void;
  initialState?: string;
  visible?: boolean;
}

const CommentForm: FC<Props> = ({
  title,
  onSubmit,
  initialState,
  busy = false,
  onClose,
  visible = true,
}): JSX.Element | null => {
  const { editor } = useEditorConfig({ placeholder: 'Add your comment ...' });

  const handleSubmit = () => {
    if (editor && !busy) {
      const value = editor?.getHTML();
      if (value === '<p></p>') return;

      onSubmit(value);
    }
  };

  useEffect(() => {
    if (typeof initialState === 'string')
      editor?.chain().focus().setContent(initialState).run();
  }, [editor, initialState]);

  if (!visible) return null;

  return (
    <div>
      {title ? (
        <h1 className="py-3 text-xl font-semibold text-primary-dark dark:text-primary-light">
          {title}
        </h1>
      ) : null}
      <EditorContent
        className="min-h-[200px] rounded border-2 border-secondary-dark p-2"
        editor={editor}
      />

      <div className="justify-end py-3 md:flex">
        <div className="flex space-x-4">
          <ActionButton busy={busy} title="Submit" onClick={handleSubmit} />

          {onClose ? (
            <button
              onClick={onClose}
              className="text-primary-dark dark:text-primary-light"
            >
              close
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
