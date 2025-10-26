import { User } from "./redux";
export type { User } from "./redux";

export interface Task {
  id: string; // MySQL ID (NestJS backend)
  title: string;
  date: string;
  priority: "high" | "medium" | "low" | "normal";
  stage: "todo" | "in progress" | "completed";
  team?: User[];
  createdBy?: User;
  comments?: Comment[];
  [key: string]: any;
}

export interface Comment {
  id: string;
  text: string;
  author?: User;
  createdAt?: string;
  [key: string]: any;
}

export interface TaskCardProps {
  task: Task;
}

export interface UserInfoProps {
  user: User;
}
