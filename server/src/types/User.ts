interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  userNameChangedAt: Date | string;
  emailChangedAt: Date | string;
  passwordChangedAt: Date | string;
}

interface UserPayload extends Omit<User, "id" | "password"> {
  userId: number;
}

export type { User, UserPayload };
