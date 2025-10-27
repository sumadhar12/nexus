import React, { useState, useEffect } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaColumns, FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import UserInfo from "../components/UserInfo";
import Loading from "../components/Loader";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Task, User } from "../types";
import { RootState } from "../redux/store";

interface TaskTableProps {
  tasks: Task[];
  currentUser: User & { isAdmin?: boolean };
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, currentUser }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const navigate = useNavigate();

  const getTasksWithin7Days = (tasks: Task[]) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= today && taskDate <= nextWeek;
    });
  };

  const filteredTasks = getTasksWithin7Days(tasks || []);

  const handleRowClick = (task: Task) => {
    const taskId = task.id;
    if (!taskId) {
      console.error("Task has no ID:", task);
      return;
    }
    navigate(`/task/${taskId}`);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-700">
      <tr className="text-white text-left">
        <th className="py-3 px-4 font-semibold">Task Title</th>
        <th className="py-3 px-4 font-semibold">Priority</th>
        <th className="py-3 px-4 font-semibold">Created By</th>
        <th className="py-3 px-4 font-semibold">Team</th>
        <th className="py-3 px-4 font-semibold hidden md:block">Deadline</th>
      </tr>
    </thead>
  );

  interface TableRowProps {
    task: Task;
    currentUser: User & { isAdmin?: boolean };
  }

  const TableRow: React.FC<TableRowProps> = ({ task }) => {
    return (
      <tr
        className="border-b border-gray-800 text-gray-300 hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => handleRowClick(task)}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div
              className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])}
            />
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-white">{task.title}</p>
            </div>
          </div>
        </td>

        <td className="py-3 px-4">
          <div className="flex gap-2 items-center">
            <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
              {ICONS[task.priority as keyof typeof ICONS]}
            </span>
            <span className="capitalize text-sm font-medium">
              {task.priority}
            </span>
          </div>
        </td>

        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center justify-center text-xs font-semibold">
              {task.createdBy?.name
                ? task.createdBy.name[0].toUpperCase()
                : "U"}
            </div>
            <span className="text-sm font-medium text-white">
              {task.createdBy?.name || "Unknown"}
            </span>
          </div>
        </td>

        <td className="py-3 px-4">
          <div className="flex">
            {task.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -mr-2 border-2 border-gray-800 shadow-sm",
                  BGS[index % BGS.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>
        <td className="py-3 px-4 hidden md:block">
          <span className="text-sm text-gray-400">
            {moment(task?.date).fromNow()}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full bg-gray-800 px-4 py-6 shadow-lg rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          Assigned Tasks (Next 7 Days)
        </h3>
        <span className="text-sm text-gray-400">
          {filteredTasks?.length || 0} tasks
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {filteredTasks?.map((task, id) => (
              <TableRow key={id} task={task} currentUser={currentUser} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      if (user?.isAdmin) {
        response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/`
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/user/${user?.email}`
        );
      }

      if (response.data) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?.email]);

  interface StatCardProps {
    label: string;
    count: number;
    bg: string;
    icon: React.ReactNode;
    textColor: string;
  }

  const Card: React.FC<StatCardProps> = ({ label, count, bg, icon }) => {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 group hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {label}
            </p>
            <span className="text-3xl font-bold text-white">{count}</span>
          </div>
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
              bg
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const stats = [
    {
      _id: "1",
      label: "My Assigned Tasks",
      total: tasks?.length || 0,
      icon: <FaNewspaper size={24} />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-400",
    },
    {
      _id: "2",
      label: "Completed",
      total: tasks?.filter((task) => task.stage === "completed")?.length || 0,
      icon: <MdAdminPanelSettings size={24} />,
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      textColor: "text-emerald-400",
    },
    {
      _id: "3",
      label: "In Progress",
      total: tasks?.filter((task) => task.stage === "in progress")?.length || 0,
      icon: <FaColumns size={24} />,
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      textColor: "text-amber-400",
    },
    {
      _id: "4",
      label: "To Do",
      total: tasks?.filter((task) => task.stage === "todo")?.length || 0,
      icon: <FaArrowsToDot size={24} />,
      bg: "bg-gradient-to-br from-rose-500 to-rose-600",
      textColor: "text-rose-400",
    },
  ];

  if (loading) {
    return (
      <div className="py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full py-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total}
            textColor=""
          />
        ))}
      </div>

      {/* Tables Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {user && <TaskTable tasks={tasks} currentUser={user} />}
      </div>
    </div>
  );
};

export default Dashboard;
