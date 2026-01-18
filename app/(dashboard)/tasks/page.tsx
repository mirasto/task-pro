"use client";

import { useEffect, useState } from "react";
import { useGetTasksQuery, Task } from "@/store/api/tasksApi";
import { TaskCard } from "@/components/tasks/TaskCard";
import { AddTaskButton } from "@/components/tasks/TaskForm";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const LOCAL_STORAGE_KEY = "taskpro_tasks";

export default function TasksPage() {
  const { user, loading: authLoading } = useAppSelector((s) => s.auth);
  const {
    data,
    isLoading,
    error,
  } = useGetTasksQuery(undefined, {
    skip: authLoading || !user,
  });
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Task[];
        setLocalTasks(parsed);
      } catch {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!data || !data.length) return;
    setLocalTasks(data);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const tasks = data ?? [];
  const effectiveTasks = tasks.length ? tasks : localTasks;

  if ((authLoading || isLoading) && !effectiveTasks.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!authLoading && error && !effectiveTasks.length) {
    return <div className="text-red-500">Error loading tasks</div>;
  }

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <AddTaskButton />
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto pr-1 custom-scrollbar">
        {effectiveTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {effectiveTasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No tasks found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
