import { User } from "./redux";
export type { User } from "./redux";

export interface Task {
  id: string;
  title: string;
  date: string;
  priority: "high" | "medium" | "low" | "normal";
  stage: "todo" | "in_progress" | "completed";
  team?: User[];
  createdBy?: User;
  comments?: Comment[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  text: string;
  author?: User;
  createdAt?: string;
}

export interface TaskCardProps {
  task: Task;
}

export interface UserInfoProps {
  user: User;
}
