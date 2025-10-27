import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaTasks, FaCalendar, FaUsers } from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineMessage,
  MdOutlineDescription,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import Loading from "../components/Loader";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "sonner";
import { Task } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor: Record<string, string> = {
  high: "bg-red-900/30",
  medium: "bg-amber-900/30",
  low: "bg-blue-900/30",
};

const TABS = [
  {
    title: "Task Details",
    icon: <FaTasks />,
    description: "View task information",
  },
  {
    title: "Discussion",
    icon: <MdOutlineMessage />,
    description: "Comments and discussion thread",
  },
];

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selected, setSelected] = useState(0);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/${id}`
      );
      if (response) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20">
        <Loading />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Task Not Found</h2>
        <p className="text-gray-400">
          The task you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">{task?.title}</h1>

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
                PRIOTITYSTYELS[task?.priority || ""],
                bgColor[task?.priority || ""]
              )}
            >
              <span className="text-lg">
                {ICONS[task?.priority as keyof typeof ICONS]}
              </span>
              <span className="uppercase">{task?.priority} Priority</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full">
              <div
                className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])}
              />
              <span className="text-gray-300 font-medium uppercase">
                {task?.stage}
              </span>
            </div>
          </div>

          {/* Task Description */}
          {task?.description && (
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-start gap-3">
                <MdOutlineDescription
                  className="text-gray-400 mt-1"
                  size={20}
                />
                <p className="text-gray-300 leading-relaxed">
                  {task?.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        <Tabs tabs={TABS} setSelected={setSelected}>
          {selected === 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Task Info */}
                <div className="space-y-6">
                  {/* Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FaCalendar className="text-primary-600" />
                      Important Dates
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-400 font-medium">
                          Created At:
                        </span>
                        <span className="text-white">
                          {new Date(task?.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-400 font-medium">
                          Created By:
                        </span>
                        <span className="text-white">
                          {task?.createdBy?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-400 font-medium">
                          Deadline:
                        </span>
                        <span className="text-white">
                          {new Date(task?.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {task?.team && task.team.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FaUsers className="text-primary-600" />
                        Task Team ({task.team.length})
                      </h3>
                      <div className="space-y-3">
                        {task?.team?.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-sm font-semibold">
                              {member?.name
                                ? member.name[0].toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {member?.name}
                              </p>
                              <span className="text-sm text-gray-400">
                                {member?.title || "Team Member"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-6">
                  {/* Task Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Task Overview
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">
                            {task?.comments?.length || 0}
                          </p>
                          <p className="text-sm text-blue-300">Comments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CommentsSection task={task} id={id!} setTask={setTask} />
          )}
        </Tabs>
      </div>
    </div>
  );
};

interface CommentsSectionProps {
  task: Task;
  id: string;
  setTask: (task: Task) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  task,
  id,
  setTask,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/comment/${id}`,
        { text: text, user: user },
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        toast.success("Comment added successfully!");
        setTask(response.data.task);
        setText("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  interface CommentCardProps {
    comment: any;
    isLast: boolean;
  }

  const CommentCard: React.FC<CommentCardProps> = ({ comment, isLast }) => {
    return (
      <div className="flex space-x-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900/30">
            <span className="text-blue-400 font-semibold">
              {comment?.author?.name
                ? comment.author.name[0].toUpperCase()
                : "U"}
            </span>
          </div>
          {!isLast && (
            <div className="w-full flex items-center">
              <div className="w-0.5 bg-gray-600 h-16"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2 mb-8">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">
              {comment?.author?.name || "Unknown User"}
            </p>
            <span className="text-xs text-gray-400">
              {moment(comment?.createdAt).fromNow()}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-gray-300">{comment?.text}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      {/* Comments Thread */}
      <div className="lg:col-span-2">
        <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <MdOutlineMessage className="text-primary-600" />
          Discussion Thread
        </h4>

        <div className="space-y-6">
          {task?.comments && task.comments.length > 0 ? (
            task.comments.map((comment, index) => (
              <CommentCard
                key={index}
                comment={comment}
                isLast={index === task.comments!.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <MdOutlineMessage className="mx-auto text-4xl text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No comments yet
              </h3>
              <p className="text-gray-400">
                Start the discussion by adding your first comment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="lg:col-span-1">
        <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4">Add Comment</h4>

          <div className="space-y-4">
            {/* Comment Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Your Comment
              </label>
              <textarea
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts, ask questions, or provide updates..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100 placeholder-gray-400 resize-none transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              label={isLoading ? "Posting..." : "Post Comment"}
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
