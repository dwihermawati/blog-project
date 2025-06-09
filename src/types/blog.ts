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
}

export interface BlogListResponse {
  data: BlogPost[];
  total: number;
  page: number;
  lastPage: number;
}
