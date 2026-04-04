import { useEffect } from 'react';

import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';

import Button from '@/components/ui/Button/Button';
import { classNames } from '@/utils/classNames';

import styles from './RichTextEditor.module.scss';

interface RichTextEditorProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({
  onChange,
  placeholder = '본문을 입력해 주세요.',
  value,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value || '<p></p>';
    if (editor.getHTML() === nextValue) {
      return;
    }

    editor.commands.setContent(nextValue, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles['shell']}>
      <div className={styles['toolbar']}>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('bold') && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          B
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('italic') && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          I
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('heading', { level: 2 }) && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          H2
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('heading', { level: 3 }) && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          H3
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('bulletList') && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          UL
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('orderedList') && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          OL
        </Button>
        <Button
          className={classNames(
            styles['toolbarButton'],
            editor.isActive('blockquote') && styles['toolbarButtonActive'],
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size='sm'
          type='button'
          variant='secondary'
        >
          인용
        </Button>
      </div>

      <div className={styles['content']}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
