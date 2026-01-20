import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '@/firebase';

const STORAGE_KEY = 'taskpro_tasks';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string; 
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
}

const getLocalTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setLocalTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      async queryFn() {
        try {
          const user = auth.currentUser;
          // Return empty array if no user, but don't error out
          // This allows the UI to just show "no tasks" or empty state
          if (!user) return { data: [] };

          const allTasks = getLocalTasks();
          // Filter tasks for the current user
          const userTasks = allTasks.filter(task => task.userId === user.uid);
          
          return { data: userTasks };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      providesTags: ['Task'],
    }),
    addTask: builder.mutation<string, Partial<Task>>({
      async queryFn(task) {
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not authenticated");

          const newTask: Task = {
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: task.title || '',
            description: task.description,
            priority: task.priority || 'medium',
            status: task.status || 'todo',
            userId: user.uid,
            createdAt: new Date().toISOString(),
            ...task,
          };

          const allTasks = getLocalTasks();
          allTasks.push(newTask);
          setLocalTasks(allTasks);

          return { data: newTask.id };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<null, { id: string; data: Partial<Task> }>({
      async queryFn({ id, data }) {
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not authenticated");

          const allTasks = getLocalTasks();
          const index = allTasks.findIndex(t => t.id === id);
          
          if (index !== -1) {
            // Ensure user owns the task
            if (allTasks[index].userId === user.uid) {
              allTasks[index] = { ...allTasks[index], ...data };
              setLocalTasks(allTasks);
            }
          }
          
          return { data: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<null, string>({
      async queryFn(id) {
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not authenticated");

          const allTasks = getLocalTasks();
          const newTasks = allTasks.filter(t => t.id !== id);
          setLocalTasks(newTasks);
          
          return { data: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
