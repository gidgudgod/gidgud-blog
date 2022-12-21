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
