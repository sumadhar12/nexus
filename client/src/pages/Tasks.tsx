import React, { useEffect, useState } from "react";
import { FaList, FaPlus, FaColumns } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Button from "../components/Button";
import BoardView from "../components/BoardView";
import AddTask from "../components/task/AddTask";
import axios from "axios";
import { useSelector } from "react-redux";
import { Task, User } from "../types";
import { RootState } from "../redux/store";

const Tasks: React.FC = () => {
  const params = useParams<{ status?: string }>();
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = params?.status || "";
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/`
      );

      if (response.data) {
        let filteredTasks = response.data.tasks;

        if (status === "in-progress") {
          filteredTasks = filteredTasks?.filter(
            (task: Task) => task.stage === "in progress"
          );
        } else if (status === "completed") {
          filteredTasks = filteredTasks?.filter(
            (task: Task) => task.stage === "completed"
          );
        } else if (status === "todo") {
          filteredTasks = filteredTasks?.filter(
            (task: Task) => task.stage === "todo"
          );
        }

        setTasks(filteredTasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [open, status, user?.email]);

  if (loading) {
    return (
      <div className="py-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              {status
                ? `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks`
                : "All Tasks"}
            </h1>
            <p className="text-gray-400">
              {status
                ? `Manage your ${status} tasks`
                : "View and manage all tasks"}
            </p>
          </div>

          {!status && (
            <Button
              label="Create New Task"
              icon={<FaPlus className="text-lg" />}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => setOpen(true)}
            />
          )}
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FaList className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">To Do</p>
                <p className="text-3xl font-bold text-blue-300">
                  {tasks.filter((task) => task.stage === "todo").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <FaColumns className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-400">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-amber-300">
                  {tasks.filter((task) => task.stage === "in progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-900/20 rounded-xl p-4 border border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <MdGridView className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">Completed</p>
                <p className="text-3xl font-bold text-green-300">
                  {tasks.filter((task) => task.stage === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks View */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        {/* <Tabs tabs={TABS} setSelected={setSelected}> */}
          <div className="px-6">
            {/* {selected !== 1 ? ( */}
              <BoardView tasks={tasks} />
            {/* ) : (
              <div className="w-full">
                <Table tasks={tasks} />
              </div>
            )} */}
          </div>
        {/* </Tabs> */}
      </div>

      {/* Add Task Modal */}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
