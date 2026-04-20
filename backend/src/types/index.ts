// Extend Elysia context types
import "shortlink-shared";

export interface AuthenticatedContext {
  user?: {
    id: number;
    email: string;
  };
}
