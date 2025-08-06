interface User {
  id: number;
  userName: string;
  email: string;
  password: string;
}

interface UserPayload extends Omit<User, "id" | "password"> {
  userId: number;
}

export type { User, UserPayload };
