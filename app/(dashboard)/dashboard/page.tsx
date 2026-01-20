"use client";

import { useGetTasksQuery } from "@/store/api/tasksApi";
import { AddTaskButton } from "@/components/tasks/TaskForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Loader2, CheckCircle, Clock, ListTodo } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { data: tasks, isLoading } = useGetTasksQuery(undefined, {
    skip: authLoading || !user,
  });
  const { t } = useTranslation();

  const displayName = user?.displayName || user?.email || "guest";

  const stats = [
    {
      label: t("dashboard.total_tasks") || "Total tasks",
      value: tasks?.length || 0,
      icon: ListTodo,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      label: t("dashboard.in_progress") || "In progress",
      value: tasks?.filter((t) => t.status === "in_progress").length || 0,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: t("dashboard.completed") || "Completed",
      value: tasks?.filter((t) => t.status === "done").length || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboard.welcome_back", { name: displayName }) || `Welcome back, ${displayName}`}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {t("dashboard.subtitle") || "Track your tasks and productivity in one place"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("dashboard.recent_tasks") || "Recent tasks"}</h2>
          <AddTaskButton />
        </div>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks?.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks?.length === 0 && (
              <p className="col-span-full text-zinc-500">
                {t("dashboard.no_tasks") || "No tasks yet. Create your first task to get started!"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
