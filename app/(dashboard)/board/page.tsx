"use client";

import { useState } from "react";
import { useGetTasksQuery, Task, useUpdateTaskMutation } from "@/store/api/tasksApi";
import { TaskCard } from "@/components/tasks/TaskCard";
import { AddTaskButton } from "@/components/tasks/TaskForm";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";

export default function BoardPage() {
  const { user, loading: authLoading } = useAppSelector((s) => s.auth);
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useGetTasksQuery(undefined, {
    skip: authLoading || !user,
  });
  const [updateTask] = useUpdateTaskMutation();
  const { t } = useTranslation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if ((authLoading || isLoading) && !tasks.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authLoading && error && !tasks.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">Please refresh the page</p>
        </div>
      </div>
    );
  }

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleStatusChange = async (task: Task, status: Task["status"]) => {
    if (task.status === status) return;
    setUpdatingId(task.id);
    await updateTask({ id: task.id, data: { status } });
    setUpdatingId(null);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("board.title") || "Board"}
          </h1>
          <p className="text-muted-foreground">
            {t("board.subtitle") || "Manage tasks by status"}
          </p>
        </div>
        <AddTaskButton />
      </div>

      {deleteError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {deleteError}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 h-full">
          {[
            { id: "todo" as const, title: t("tasks.status.todo") || "To Do" },
            { id: "in_progress" as const, title: t("tasks.status.in_progress") || "In Progress" },
            { id: "done" as const, title: t("tasks.status.done") || "Done" },
          ].map((column) => (
          <div
            key={column.id}
            className={clsx(
              "flex h-full min-h-[600px] flex-1 flex-col rounded-2xl p-6 transition-all duration-300",
              column.id === "todo" &&
                "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/20 border border-blue-200/50 dark:border-blue-800/30",
              column.id === "in_progress" &&
                "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-950/20 border border-yellow-200/50 dark:border-yellow-800/30",
              column.id === "done" &&
                "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-950/20 border border-green-200/50 dark:border-green-800/30"
            )}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "h-3 w-3 rounded-full",
                    column.id === "todo" && "bg-blue-500",
                    column.id === "in_progress" && "bg-yellow-500",
                    column.id === "done" && "bg-green-500"
                  )}
                />
                <h3 className="font-semibold text-lg text-foreground">
                  {column.title}
                </h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {tasksByStatus[column.id].length}
              </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {tasksByStatus[column.id].map((task) => (
                <div key={task.id} className="space-y-2">
                  <TaskCard task={task} onDeleteError={setDeleteError} />
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {t("Task status") || "Змінити статус задачі"}
                    </span>
                    {(["todo", "in_progress", "done"] as Task["status"][]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(task, status)}
                        disabled={updatingId === task.id || task.status === status}
                        className={clsx(
                          "h-10 min-w-[40px] rounded-full border px-3 text-[11px] font-medium transition-colors flex items-center justify-center",
                          task.status === status
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:bg-muted"
                        )}
                      >
                        {t(`tasks.status.${status}`)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {tasksByStatus[column.id].length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p className="text-sm font-medium">
                    {t("board.no_tasks") || "No tasks in this column yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
