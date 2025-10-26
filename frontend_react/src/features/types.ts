// types for file object
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

// authSlice.ts
export interface AuthProps {
  email: string;
  password: string;
}

export interface ProfileProps {
  id: number;
  nickName: string;
  img: File | null;
}

export interface nickNameProps {
  nickName: string;
}

//inst_post
export interface InstNewPostProps {
  title: string;
  img: File | null;
}

export interface InstLikedProps {
  id: number;
  title: string;
  current: number[];
  new: number;
}

export interface InstCommentProps {
  text: string;
  post: number;
}

export interface InstPostProps {
  postId: number;
  loginId: number;
  userPost: number;
  title: string;
  imageUrl: string;
  liked: number[];
}
