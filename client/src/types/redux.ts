// Types for Redux state
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  title?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isSidebarOpen: boolean;
}

// Root state interface
export interface RootState {
  auth: AuthState;
}
