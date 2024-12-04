// Core types
export interface User {
  id: string;
  username: string;
  email?: string; // Optional if not always available
  profilePicture: string;
  createdAt?: string;
  updatedAt?: string;
  followers?: Follower[];
  following?: Following[];
  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];
}

export interface Follower {
  id: string;
  username?: string;
  profilePicture?: string;
  follower: User;
}

export interface Following {
  id: string;
  username?: string;
  profilePicture?: string;
}

export interface Like {
  user: User;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post {
  id: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  author: User;
  comments: Comment[];
  likes: Like[];
}

// Context types
export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  triggerRefresh: () => void;
}

export interface PostContextType {
  refreshFeed: boolean;
  triggerRefresh: () => void;
}

// Props types
export interface PostCardProps {
  post: Post;
}

export interface PostListProps {
  posts: Post[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface ProfilePictureUploaderProps {
  targetUser: User;
}

export interface PostDetailParams {
  postId: string;
}

export interface UserDetailParams {
  userId: string;
}
