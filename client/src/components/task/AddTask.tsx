import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Task, User } from "../../types";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
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

  const navigate = useNavigate();

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
  const submitHandler = async (data: FormData) => {
    if (type === "edit") {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/update/${task?.id
          }`,
          {
            title: data.title,
            date: data.date,
            priority: priority.toLowerCase(),
            stage: stage.toLowerCase(),
            team: team,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          // navigate("/tasks");
          toast.success("task edited succesfully !");
          window.location.reload();
        } else {
          console.log("error");
        }
      } catch (error) {
        toast.error("something went wrong !");
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/task/create`,
          {
            title: data.title,
            date: data.date,
            priority: priority,
            stage: stage,
            team: team,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          toast.success("task created succesfully !!");
          navigate("/tasks");
        } else {
          console.log("error");
        }
      } catch (error) {
        toast.error("something went wrong !");
        console.log(error);
      }
    }
    setOpen(false);
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
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
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
