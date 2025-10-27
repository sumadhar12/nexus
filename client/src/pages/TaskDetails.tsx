import clsx from "clsx";
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
import axios from "axios";
import { toast } from "sonner";
import { Task } from "../types";

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
            <CommentsSection />
          )}
        </Tabs>
      </div>
    </div>
  );
};

function CommentsSection() {
  return (
    <>
      <p className="text-white text-center">comments</p>
    </>
  );
}

export default TaskDetails;
