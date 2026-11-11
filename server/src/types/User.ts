interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  emailChangedAt: Date;
  passwordChangedAt: Date;
}

interface UserPayload extends Omit<User, "id" | "password"> {
  userId: number;
}

export type { User, UserPayload };
