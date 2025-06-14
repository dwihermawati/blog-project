export interface Author {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  author: Author;
  likedByUser: boolean;
}

export interface BlogListResponse {
  data: BlogPost[];
  total: number;
  page: number;
  lastPage: number;
}

export interface DeletePostSuccessResponse {
  success: boolean;
}

export interface LikedByUser {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
  avatarUrl?: string | null;
}

export type PostLikesResponse = LikedByUser[];

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: number;
    name: string;
    email: string;
    headline?: string | null;
    avatarUrl?: string | null;
  };
}

export type PostCommentsResponse = Comment[];

export interface CreateCommentPayload {
  content: string;
}

export interface CreateCommentSuccessResponse extends Comment {}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags: string[];
  image: File;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  tags?: string[];
  image?: File;
}
