declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      username: string;
      email: string;
      profilePicture?: string | null;
      createdAt: Date;
    };
  }
}
