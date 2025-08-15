interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  userNameChangedAt: string;
  emailChangedAt: string;
  passwordChangedAt: string;
}

interface UserPayload extends Omit<User, "id" | "password"> {
  userId: number;
}

export type { User, UserPayload };
