import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'next-share';
import { FC } from 'react';
import {
  FaFacebook,
  FaLinkedin,
  FaReddit,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';

interface Props {
  url: string;
  title?: string;
  quote?: string;
}

const Share: FC<Props> = ({ url, title, quote }): JSX.Element => {
  return (
    <div className="flex items-center space-x-3">
      <p className="font-semibold text-primary-dark dark:text-primary-light">
        Share:
      </p>
      <FacebookShareButton url={url} quote={quote} title={title}>
        <FaFacebook
          size={32}
          className="text-primary-dark dark:text-primary-light"
        />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <FaTwitter
          size={32}
          className="text-primary-dark dark:text-primary-light"
        />
      </TwitterShareButton>
      <LinkedinShareButton url={url} source={quote} title={title}>
        <FaLinkedin
          size={32}
          className="text-primary-dark dark:text-primary-light"
        />
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={title} separator=":: ">
        <FaWhatsapp
          size={32}
          className="text-primary-dark dark:text-primary-light"
        />
      </WhatsappShareButton>
      <RedditShareButton url={url} title={title}>
        <FaReddit
          size={32}
          className="text-primary-dark dark:text-primary-light"
        />
      </RedditShareButton>
    </div>
  );
};

export default Share;
