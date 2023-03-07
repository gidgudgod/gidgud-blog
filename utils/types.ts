export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  meta: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
}

export interface SeoResult {
  meta: string;
  slug: string;
  tags: string;
}

export interface FinalPost extends SeoResult {
  id?: string;
  title: string;
  content: string;
  thumbnail?: File | string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  role: 'user' | 'admin';
}

export type replyComments = CommentResponse[];
export interface CommentResponse {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByOwner?: boolean;
  replies?: replyComments;
  repliedTo?: string;
  chiefComment?: boolean;
  owner: {
    name: string;
    id: string;
    avatar?: string;
  };
}
