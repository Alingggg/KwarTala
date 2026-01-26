interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  emailChangedAt: string;
  passwordChangedAt: string;
}

export type { User };
