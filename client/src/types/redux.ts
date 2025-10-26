// Types for Redux state
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  isSidebarOpen: boolean;
}

// Root state interface
export interface RootState {
  auth: AuthState;
  api: any;
}

