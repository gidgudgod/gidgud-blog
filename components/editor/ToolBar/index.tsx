import { Editor } from '@tiptap/react';
import { FC } from 'react';
import DropdownOptions from '../../common/DropdownOptions';
import { AiFillCaretDown } from 'react-icons/ai';
import { getFocusedEditor } from '../editorUtils';
import Button from './Button';
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsTypeStrikethrough,
  BsCode,
  BsBraces,
  BsListOl,
  BsListUl,
  BsImageFill,
} from 'react-icons/bs';
import { RiDoubleQuotesL } from 'react-icons/ri';
import InsertLink from '../Link/InsertLink';
import { linkOption } from '../Link/LinkForm';
import EmbedYoutube from './EmbedYoutube';

interface Props {
  editor: Editor | null;
  onOpenImageClick?: () => void;
}

const ToolBar: FC<Props> = ({
  editor,
  onOpenImageClick,
}): JSX.Element | null => {
  if (!editor) return null;

  const options = [
    {
      label: 'Paragraph',
      onClick: () => getFocusedEditor(editor).setParagraph().run(),
    },
    {
      label: 'Heading 1',
      onClick: () => getFocusedEditor(editor).toggleHeading({ level: 1 }).run(),
    },
    {
      label: 'Heading 2',
      onClick: () => getFocusedEditor(editor).toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Heading 3',
      onClick: () => getFocusedEditor(editor).toggleHeading({ level: 3 }).run(),
    },
  ];

  const getLabel = (): string => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';

    return 'Paragraph';
  };

  const DropdownHead = () => {
    return (
      <div className="dark: flex items-center space-x-2 text-primary-dark dark:text-primary-light">
        <p>{getLabel()}</p>
        <AiFillCaretDown />
      </div>
    );
  };

  const handleLinkSubmit = ({ url, openInNewTab }: linkOption) => {
    const { commands } = editor;
    if (openInNewTab) commands.setLink({ href: url, target: '_blank' });
    else commands.setLink({ href: url });
  };

  const handleEmbedYoutube = (url: string) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  return (
    <div className="flex items-center">
      {/* paragraph, heading 1, 2, 3 */}
      <DropdownOptions options={options} head={<DropdownHead />} />

      <div className="mx-8 h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light" />

      <div className="flex items-center space-x-3">
        <Button
          active={editor.isActive('bold')}
          onClick={() => getFocusedEditor(editor).toggleBold().run()}
        >
          <BsTypeBold />
        </Button>
        <Button
          active={editor.isActive('italic')}
          onClick={() => getFocusedEditor(editor).toggleItalic().run()}
        >
          <BsTypeItalic />
        </Button>
        <Button
          active={editor.isActive('underline')}
          onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
        >
          <BsTypeUnderline />
        </Button>
        <Button
          active={editor.isActive('strike')}
          onClick={() => getFocusedEditor(editor).toggleStrike().run()}
        >
          <BsTypeStrikethrough />
        </Button>
      </div>
      <div className="mx-8 h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light" />

      <div className="flex items-center space-x-3">
        <Button
          active={editor.isActive('blockquote')}
          onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </Button>
        <Button
          active={editor.isActive('code')}
          onClick={() => getFocusedEditor(editor).toggleCode().run()}
        >
          <BsCode />
        </Button>
        <Button
          active={editor.isActive('codeBlock')}
          onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
        >
          <BsBraces />
        </Button>
        <Button
          active={editor.isActive('orderedList')}
          onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
        >
          <BsListOl />
        </Button>
        <Button
          active={editor.isActive('bulletList')}
          onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
        >
          <BsListUl />
        </Button>
        <InsertLink onSubmit={handleLinkSubmit} />
      </div>
      <div className="mx-8 h-4 w-[1px] bg-secondary-dark dark:bg-secondary-light" />

      <div className="flex items-center space-x-3">
        <Button onClick={onOpenImageClick}>
          <BsImageFill />
        </Button>
        <EmbedYoutube onSubmit={handleEmbedYoutube} />
      </div>
    </div>
  );
};

export default ToolBar;
