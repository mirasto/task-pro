"use client";

import { useGetTasksQuery } from "@/store/api/tasksApi";
import { TaskCard } from "@/components/tasks/TaskCard";
import { AddTaskButton } from "@/components/tasks/TaskForm";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export default function TasksPage() {
  const { user, loading: authLoading } = useAppSelector((s) => s.auth);
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery(undefined, {
    skip: authLoading || !user,
  });

  if (authLoading || (isLoading && !tasks)) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authLoading && error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        Error loading tasks
      </div>
    );
  }

  const effectiveTasks = tasks || [];

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Tasks</h1>
            <p className="text-muted-foreground">View all your tasks in one place</p>
        </div>
        <AddTaskButton />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {effectiveTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {effectiveTasks.map((task) => (
              <div key={task.id} className="h-full">
                <TaskCard task={task} showFullContent={true} className="h-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
            <p>No tasks found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
