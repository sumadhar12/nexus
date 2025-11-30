import React, { useState } from "react";
import { FaList, FaPlus, FaColumns } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Button from "../components/Button";
import BoardView from "../components/BoardView";
import AddTask from "../components/task/AddTask";
import { useGetTasksQuery } from "../redux/slices/taskApiSlice";

const Tasks: React.FC = () => {
  const params = useParams<{ status?: string }>();
  const status = params?.status || "";
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetTasksQuery(status !== "all" ? status : "");
  const tasks = data?.tasks || [];

  if (isLoading) {
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
          {[
            {
              label: "To Do",
              stage: "todo",
              bg: "bg-blue-900/20",
              border: "border-blue-700",
              text: "text-blue-400",
              countText: "text-blue-300",
              iconBg: "bg-blue-500",
              icon: <FaList className="text-white text-xl" />,
            },
            {
              label: "In Progress",
              stage: "in_progress",
              bg: "bg-amber-900/20",
              border: "border-amber-700",
              text: "text-amber-400",
              countText: "text-amber-300",
              iconBg: "bg-amber-500",
              icon: <FaColumns className="text-white text-xl" />,
            },
            {
              label: "Completed",
              stage: "completed",
              bg: "bg-green-900/20",
              border: "border-green-700",
              text: "text-green-400",
              countText: "text-green-300",
              iconBg: "bg-green-500",
              icon: <MdGridView className="text-white text-xl" />,
            },
          ]
            .filter((stat) => !status || status === stat.stage)
            .map((stat, index) => (
              <div
                key={index}
                className={`${stat.bg} rounded-xl p-4 border ${stat.border}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${stat.text}`}>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${stat.countText}`}>
                      {
                        tasks.filter((task) => task.stage === stat.stage)
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tasks View */}
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        {/* <Tabs tabs={TABS} setSelected={setSelected}> */}
        <div className="px-6">
          {/* {selected !== 1 ? ( */}
          {tasks.length > 0 ? (
            <BoardView tasks={tasks} />
          ) : (
            <div className="py-20 text-center">
              <div className="p-4 rounded-full bg-gray-700/50 mb-4 inline-block">
                <FaList className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-400 mb-6">
                {status
                  ? `No ${status} tasks found.`
                  : "No tasks found. Create a new task to get started."}
              </p>
              {!status && (
                <Button
                  label="Create New Task"
                  icon={<FaPlus className="text-lg" />}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg py-2 px-6 transition-all duration-200"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          )}
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
