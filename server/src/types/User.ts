interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserPayload extends Omit<User, "password" | "id"> {
  userId: number;
}

export type { User, UserPayload };
