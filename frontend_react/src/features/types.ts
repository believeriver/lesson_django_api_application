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
