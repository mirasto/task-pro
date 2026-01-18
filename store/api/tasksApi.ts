import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db, auth } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const DELETE_QUEUE_KEY = 'taskpro_delete_queue';

const addToDeleteQueue = (id: string) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(DELETE_QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    if (!parsed.includes(id)) {
      parsed.push(id);
      window.localStorage.setItem(DELETE_QUEUE_KEY, JSON.stringify(parsed));
    }
  } catch {
  }
};

const processDeleteQueue = async (collectionPath: string) => {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem(DELETE_QUEUE_KEY);
  if (!raw) return;
  let ids: string[];
  try {
    ids = JSON.parse(raw) as string[];
  } catch {
    window.localStorage.removeItem(DELETE_QUEUE_KEY);
    return;
  }
  if (!ids.length) return;
  const remaining: string[] = [];
  for (const id of ids) {
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
    } catch {
      remaining.push(id);
    }
  }
  if (remaining.length) {
    window.localStorage.setItem(DELETE_QUEUE_KEY, JSON.stringify(remaining));
  } else {
    window.localStorage.removeItem(DELETE_QUEUE_KEY);
  }
};

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

          const collectionPath = user.isAnonymous
            ? `guests/${user.uid}/tasks`
            : `users/${user.uid}/tasks`;

          if (typeof window !== 'undefined') {
            await processDeleteQueue(collectionPath);
          }

          const q = query(collection(db, collectionPath));
          const querySnapshot = await getDocs(q);
          const tasks: Task[] = [];
          querySnapshot.forEach((docSnapshot) => {
            tasks.push({ id: docSnapshot.id, ...docSnapshot.data() } as Task);
          });

          let filteredTasks = tasks;
          if (typeof window !== 'undefined') {
            const rawQueue = window.localStorage.getItem(DELETE_QUEUE_KEY);
            if (rawQueue) {
              try {
                const queuedIds = JSON.parse(rawQueue) as string[];
                if (queuedIds.length) {
                  filteredTasks = tasks.filter((task) => !queuedIds.includes(task.id));
                }
              } catch {
              }
            }
          }

          return { data: filteredTasks };
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

          const collectionPath = user.isAnonymous
            ? `guests/${user.uid}/tasks`
            : `users/${user.uid}/tasks`;

          const newTask = {
            ...task,
            userId: user.uid,
            createdAt: new Date().toISOString(),
          };

          const docRef = await addDoc(collection(db, collectionPath), newTask);
          return { data: docRef.id };
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

          const collectionPath = user.isAnonymous
            ? `guests/${user.uid}/tasks`
            : `users/${user.uid}/tasks`;

          const docRef = doc(db, collectionPath, id);
          await updateDoc(docRef, data);
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

          const collectionPath = user.isAnonymous
            ? `guests/${user.uid}/tasks`
            : `users/${user.uid}/tasks`;

          const docRef = doc(db, collectionPath, id);
          await deleteDoc(docRef);
          return { data: null };
        } catch (error: any) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Task'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draft) => {
            const index = draft.findIndex((task) => task.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          addToDeleteQueue(id);
        }
      },
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
