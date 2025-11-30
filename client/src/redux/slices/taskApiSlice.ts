import { apiSlice } from "./apiSlice";
import { Task, User } from "../../types";

const TASK_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<{ status: boolean; tasks: Task[] }, string | void>({
      query: (stage) => ({
        url: `${TASK_URL}${stage ? `?stage=${stage}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    getTask: builder.query<{ status: boolean; task: Task }, string>({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    getDashboardTasks: builder.query<
      { status: boolean; tasks: Task[] },
      { email: string }
    >({
      query: ({ email }) => ({
        url: `${TASK_URL}/user/${email}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    createTask: builder.mutation<void, Partial<Task>>({
      query: (data) => ({
        url: `${TASK_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation<void, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: `${TASK_URL}/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Task",
        { type: "Task", id },
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),

    addComment: builder.mutation<
      { status: boolean; task: Task },
      { id: string; text: string; user: User }
    >({
      query: ({ id, text, user }) => ({
        url: `${TASK_URL}/comment/${id}`,
        method: "POST",
        body: { text, user },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Task",
        { type: "Task", id },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddCommentMutation,
  useGetDashboardTasksQuery,
} = taskApiSlice;
