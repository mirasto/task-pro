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
  order: number;
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
          if (!user) return { data: [] };

          const allTasks = getLocalTasks();
          const userTasks = allTasks.filter(task => task.userId === user.uid);
          
          // Sort by order, then by createdAt as fallback
          userTasks.sort((a, b) => {
             if (a.order !== b.order) return a.order - b.order;
             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });

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

          const allTasks = getLocalTasks();
          const userTasks = allTasks.filter(t => t.userId === user.uid && t.status === (task.status || 'todo'));
          
          // New tasks go to the end
          const maxOrder = userTasks.length > 0 ? Math.max(...userTasks.map(t => t.order || 0)) : -1;

          const newTask: Task = {
            id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: task.title || '',
            description: task.description,
            priority: task.priority || 'medium',
            status: task.status || 'todo',
            userId: user.uid,
            createdAt: new Date().toISOString(),
            order: maxOrder + 1,
            ...task,
          };

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
    reorderTasks: builder.mutation<null, { tasks: { id: string; order: number; status: Task['status'] }[] }>({
        async queryFn({ tasks }) {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not authenticated");

                const allTasks = getLocalTasks();
                let changed = false;

                tasks.forEach(update => {
                    const index = allTasks.findIndex(t => t.id === update.id);
                    if (index !== -1 && allTasks[index].userId === user.uid) {
                        allTasks[index].order = update.order;
                        allTasks[index].status = update.status;
                        changed = true;
                    }
                });

                if (changed) {
                    setLocalTasks(allTasks);
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

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, useReorderTasksMutation } = tasksApi;
