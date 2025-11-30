import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { toast } from "sonner";
import { Task, User } from "../../types";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/taskApiSlice";

const LISTS = ["TODO", "IN_PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

interface AddTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task?: Task;
  type?: string;
}

interface FormData {
  title: string;
  date: string;
}

const AddTask: React.FC<AddTaskProps> = ({ open, setOpen, task, type }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [team, setTeam] = useState<User[]>(task?.team || []);
  const [stage, setStage] = useState<string>(
    task?.stage?.toUpperCase() || LISTS[0]
  );
  const [priority, setPriority] = useState<string>(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const submitHandler = async (data: FormData) => {
    try {
      const taskData: Partial<Task> = {
        title: data.title,
        date: data.date,
        priority: priority.toLowerCase() as Task["priority"],
        stage: stage.toLowerCase() as Task["stage"],
        team: team,
      };

      if (type === "edit" && task?.id) {
        await updateTask({ id: task.id, data: taskData }).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await createTask(taskData).unwrap();
        toast.success("Task created successfully!");
      }
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-white mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              defaultValue={task?.title}
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />
            <UserList setTeam={setTeam} team={team} />
            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  defaultValue={
                    task?.date
                      ? new Date(task.date).toISOString().substring(0, 10)
                      : ""
                  }
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            <div className="py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label={isCreating || isUpdating ? "Submitting..." : "Submit"}
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                disabled={isCreating || isUpdating}
              />

              <Button
                type="button"
                className="bg-blue-600 px-5 text-sm font-semibold text-white sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
