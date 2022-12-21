import axios from 'axios';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmModal from '../../../components/common/ConfirmModal';
import InfiniteScrollPosts from '../../../components/common/InfiniteScrollPosts';
import PostCard from '../../../components/common/PostCard';
import AdminLayout from '../../../components/layout/AdminLayout';
import { formatPosts, readPostsFromDb } from '../../../lib/utils';
import { filterPosts } from '../../../utils/helper';
import { PostDetail } from '../../../utils/types';

const postsss = [
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, aperiam voluptatibus molestiae similique dignissimos quidem repellat aliquid est, quisquam ducimus harum possimus iusto ipsum quo ipsam pariatur itaque totam temporibus.',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'so good',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'so good',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'so good',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'so good',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
  {
    _id: {
      $oid: '6391bf70e85b7c6c922d9bf3',
    },
    title: 'This Controller is Sick u must buy it :)',
    slug: 'this-controller-is-sick-u-must-buy-it-:)',
    content:
      '<p>wew</p><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">bought it here</a></p><blockquote><p><strong>i dont know why life kindaaaa good :D</strong></p></blockquote><div data-youtube-video=""><iframe class="mx-auto rounded" width="840" height="472.5" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/jfKfPfyJRdk" start="0"></iframe></div><img class="mx-auto" src="https://res.cloudinary.com/gidgud/image/upload/v1669896512/gidgud-blog/ahxyn4y1mez46ai5urnd.jpg" alt="">',
    meta: 'so good',
    tags: ['something', 'new', 'controller'],
    thumbnail:
      'https://res.cloudinary.com/gidgud/image/upload/v1670496117/gidgud-blog/tc5vjrisapxjhawq53h3.png',

    createdAt: '1670496119673',

    updatedAt: '1670496310671',
  },
];

let pageNumber = 0;
const limit = 9;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ posts }) => {
  const [postsToRender, setPoststoRender] = useState(posts);
  const [hasMorePosts, setHasMorePosts] = useState(posts.length >= limit);

  const fetchMorePosts = async () => {
    try {
      pageNumber++;
      const { data } = await axios(
        `/api/posts?limit=${limit}&skip=${postsToRender.length}`
      );

      if (data.posts.length < limit) {
        setPoststoRender([...postsToRender, ...data.posts]);
        setHasMorePosts(false);
      } else {
        setPoststoRender([...postsToRender, ...data.posts]);
      }
    } catch (error) {
      setHasMorePosts(false);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout>
        <InfiniteScrollPosts
          hasMore={hasMorePosts}
          next={fetchMorePosts}
          dataLength={postsToRender.length}
          posts={postsToRender}
          showControls={true}
          onPostRemoved={(post) => {
            setPoststoRender(filterPosts(postsToRender, post));
          }}
        />
      </AdminLayout>
      <ConfirmModal
        // visible
        title="Are you sure?"
        subTitle="This will remove the post permanently"
        // busy
      />
    </>
  );
};

interface ServerSideResponse {
  posts: PostDetail[];
}

//nssp
export const getServerSideProps: GetServerSideProps<
  ServerSideResponse
> = async (ctx) => {
  try {
    const posts = await readPostsFromDb(limit, pageNumber);

    if (!posts) return { notFound: true };
    const formattedPosts = formatPosts(posts);
    return {
      props: {
        posts: formattedPosts,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default Posts;
