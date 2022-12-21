import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import slugify from 'slugify';
import { SeoResult } from '../../utils/types';

const commonInput =
  'w-full rounded border-2 border-secondary-dark bg-transparent p-2 text-primary-dark outline-none transition focus:border-primary-dark dark:border-secondary-light dark:text-primary-light focus:dark:border-primary-light';

interface Props {
  initialValue?: SeoResult;
  title?: string;
  onChange(result: SeoResult): void;
}

const SEOForm: FC<Props> = ({
  initialValue,
  title = '',
  onChange,
}): JSX.Element => {
  const [values, setValues] = useState({ meta: '', slug: '', tags: '' });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = ({ target }) => {
    let { name, value } = target;
    if (name === 'meta') value = value.substring(0, 150);
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange(newValues);
  };

  const { meta, slug, tags } = values;

  useEffect(() => {
    const slug = slugify(title.toLowerCase(), {
      strict: true,
    });
    const newValues = { ...values, slug };
    setValues(newValues);
    onChange(newValues);
  }, [title]);

  useEffect(() => {
    if (initialValue)
      setValues({
        ...initialValue,
        slug: slugify(initialValue.slug, { strict: true }),
      });
  }, [initialValue]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-primary-dark dark:text-primary-light">
        SEO Section
      </h1>
      <Input
        onChange={handleChange}
        value={slug}
        name="slug"
        placeholder="slug-goes-here"
        label="Slug:"
      />
      <Input
        onChange={handleChange}
        value={tags}
        name="tags"
        placeholder="React, Next JS"
        label="Tags:"
      />
      <div className="relative">
        <textarea
          onChange={handleChange}
          name="meta"
          value={meta}
          className={classnames(commonInput, 'h-20 resize-none text-lg')}
          placeholder="Meta description 150 characters will be fine"
        ></textarea>
        <p className="dark: absolute bottom-3 right-3 text-sm text-primary-dark dark:text-primary-light">
          {meta.length}/150
        </p>
      </div>
    </div>
  );
};

const Input: FC<{
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ name, value, placeholder, label, onChange }) => {
  return (
    <label className="relative block">
      <span className="absolute top-1/2 -translate-y-1/2 pl-2 text-sm font-semibold text-primary-dark dark:text-primary-light">
        {label}
      </span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className={classnames(commonInput, 'pl-10 italic')}
        onChange={onChange}
        value={value}
      />
    </label>
  );
};

export default SEOForm;
