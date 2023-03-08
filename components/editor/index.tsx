import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TipTapImage from '@tiptap/extension-image';
import ToolBar from './ToolBar';
import EditLink from './Link/EditLink';
import GalleryModal, { ImageSelectionResult } from './GalleryModal';
import axios from 'axios';
import SEOForm from './SeoForm';
import ActionButton from '../common/ActionButton';
import ThumbnailSelector from './ThumbnailSelector';
import { FinalPost, SeoResult } from '../../utils/types';

interface Props {
  initialValue?: FinalPost;
  btnTitle?: string;
  busy?: boolean;
  onSubmit(post: FinalPost): void;
}

const Editor: FC<Props> = ({
  initialValue,
  btnTitle = 'Submit',
  busy = false,
  onSubmit,
}): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>();
  const [post, setPost] = useState<FinalPost>({
    title: '',
    content: '',
    meta: '',
    tags: '',
    slug: '',
  });

  const fetchImages = async () => {
    const { data } = await axios('/api/image');
    setImages(data.images);
  };

  const handleImageUpload = async (image: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    const { data } = await axios.post('/api/image', formData);
    setUploading(false);

    setImages([data, ...images]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Write something …',
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: '',
        },
      }),
      Youtube.configure({
        // width: 840,
        // height: 472.5,
        HTMLAttributes: {
          class: 'w-full aspect-video',
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: 'mx-auto',
        },
      }),
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          'prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full',
      },
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run();
  };

  const updateTitle: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setPost({ ...post, title: target.value });
  };

  const updateSeoValue = (result: SeoResult) => {
    setPost({ ...post, ...result });
  };

  const updateThumbnail = (file: File) => {
    setPost({ ...post, thumbnail: file });
  };

  const handleSubmit = () => {
    if (!editor) return;

    onSubmit({ ...post, content: editor.getHTML() });
  };

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (initialValue) {
      setPost({ ...initialValue });
      editor?.commands.setContent(initialValue.content);

      const { meta, slug, tags } = initialValue;
      setSeoInitialValue({ meta, slug, tags });
    }
  }, [initialValue, editor]);

  return (
    <>
      <div className="bg-primary-light p-3 transition dark:bg-primary-dark">
        <div className="sticky top-0 z-10 bg-primary-light dark:bg-primary-dark">
          {/* thumbnail selector and submit button */}
          <div className="mb-3 flex items-center justify-between">
            <ThumbnailSelector
              initialValue={post.thumbnail as string}
              onChange={updateThumbnail}
            />
            <div className="inline-block">
              <ActionButton
                busy={busy}
                title={btnTitle}
                onClick={handleSubmit}
              />
            </div>
          </div>
          {/* title input */}
          <input
            type="text"
            placeholder="Title"
            className="mb-3 w-full border-0 border-b-[1px] border-secondary-dark bg-transparent py-2 text-3xl font-semibold italic
             text-primary-dark outline-none dark:border-secondary-light dark:text-primary-light"
            onChange={updateTitle}
            value={post.title}
          />
          <ToolBar
            editor={editor}
            onOpenImageClick={() => setShowGallery(true)}
          />
          <div className="my-3 h-[1px] w-full bg-secondary-dark dark:bg-secondary-light" />
          {editor && <EditLink editor={editor} />}
        </div>

        <EditorContent editor={editor} className="min-h-[300px]" />
        <div className="my-3 h-[1px] w-full bg-secondary-dark dark:bg-secondary-light" />
        <SEOForm
          onChange={updateSeoValue}
          title={post.title}
          initialValue={seoInitialValue}
        />
      </div>
      <GalleryModal
        images={images}
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
        uploading={uploading}
      />
    </>
  );
};

export default Editor;
