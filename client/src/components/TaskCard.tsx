import clsx from "clsx";
import React from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, formatDate } from "../utils";
import { BiMessageAltDetail } from "react-icons/bi";
import UserInfo from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { TaskCardProps, User } from "../types";
import { RootState } from "../redux/store";
import TaskDialog from "./task/TaskDialog";

const ICONS: Record<string, React.ReactNode> = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-navigate]")) {
      return;
    }
    navigate(`/task/${task.id}`);
  };

  const getPriorityColor = (priority?: string): string => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-900/20";
      case "medium":
        return "text-amber-400 bg-amber-900/20";
      case "low":
        return "text-green-400 bg-green-900/20";
      case "normal":
        return "text-blue-400 bg-blue-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const getStageColor = (stage?: string): string => {
    switch (stage) {
      case "todo":
        return "bg-blue-500";
      case "in_progress":
        return "bg-amber-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div
        className="w-full bg-gray-800 shadow-lg hover:shadow-xl rounded-xl border border-gray-700 transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="w-full flex justify-between items-start mb-4">
            <div
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                getPriorityColor(task?.priority)
              )}
            >
              <span className="text-lg">{ICONS[task?.priority || "low"]}</span>
              <span className="uppercase font-semibold">
                {task?.priority} Priority
              </span>
            </div>

            <div data-no-navigate>
              <TaskDialog task={task} />
            </div>
          </div>

          {/* Task Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "w-3 h-3 rounded-full",
                  getStageColor(task.stage)
                )}
              />
              <h4 className="text-lg font-semibold text-white line-clamp-2">
                {task?.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-medium">Due:</span>
              <span>{formatDate(new Date(task?.date))}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-medium">Created by:</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-xs font-semibold">
                  {task.createdBy?.name
                    ? task.createdBy.name[0].toUpperCase()
                    : "U"}
                </div>
                <span>{task.createdBy?.name || "Unknown"}</span>
              </div>
            </div>

            {/* Show if current user is assigned to this task */}
            {task.team?.some((member) => member.email === user?.email) && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Assigned to you</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200via-gray-700 to-transparent" />

        {/* Stats */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BiMessageAltDetail className="text-lg" />
                <span className="font-medium">
                  {task?.comments?.length || 0}
                </span>
                <span>comments</span>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex flex-row-reverse">
              {task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-2 border-2 border-whiteborder-gray-800 shadow-sm",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
