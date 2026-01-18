"use client";

import { useState } from "react";
import { Task } from "@/store/api/tasksApi";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/store/api/tasksApi";
import { motion } from "framer-motion";
import { Trash2, Edit, CheckCircle, Circle, Clock, Calendar, Tag, User } from "lucide-react";
import { clsx } from "clsx";
function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}>
      {children}
    </span>
  );
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200/50",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200/50",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200/50",
};

const statusIcons = {
  todo: <Circle className="h-4 w-4 text-blue-500" />,
  in_progress: <Clock className="h-4 w-4 text-yellow-500" />,
  done: <CheckCircle className="h-4 w-4 text-green-500" />,
};

import { useTranslation } from "react-i18next";

interface TaskCardProps {
  task: Task;
  className?: string;
  onDeleteError?: (message: string) => void;
}

export function TaskCard({ task, className, onDeleteError }: TaskCardProps) {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (isDeleting) return;
    setDeleteError(null);
    try {
      await deleteTask(task.id).unwrap();
    } catch {
      const message = t("tasks.delete_error") || "Не вдалося синхронізувати видалення задачі";
      setDeleteError(message);
      if (onDeleteError) {
        onDeleteError(message);
      }
    }
  };

  const toggleStatus = async () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask({ id: task.id, data: { status: newStatus } });
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';

  return (
    <div className={className}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        className="relative overflow-hidden"
      >
        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 card-hover">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2 pr-8">
              <SimpleBadge className={priorityColors[task.priority]}>
                {task.priority.toUpperCase()}
              </SimpleBadge>
              <div className="flex items-center gap-1">
                {statusIcons[task.status]}
              </div>
            </div>
            <CardTitle className="text-lg font-semibold text-foreground break-words">
              {task.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 space-y-3">
            {task.description && (
              <p className="text-sm text-muted-foreground break-words">
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <div className={clsx(
                "flex items-center gap-2 text-xs",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                <Calendar className="h-3 w-3" />
                <span>{dueDate?.toLocaleDateString()}</span>
                {isOverdue && <span className="font-semibold">(Overdue)</span>}
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, idx) => (
                  <SimpleBadge key={idx} className="bg-muted text-muted-foreground text-xs">
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </SimpleBadge>
                ))}
              </div>
            )}

            {task.assignedTo && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{task.assignedTo}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-3 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleStatus}
              disabled={isUpdating || isDeleting}
              className="flex-1 h-8 text-xs"
            >
              {task.status === 'done' ? (
                <>
                  <Circle className="mr-1 h-3 w-3" />
                  Undo
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Complete
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
              className="h-8 px-2"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {deleteError && (
        <div className="mt-2 text-xs text-destructive">
          {deleteError}
        </div>
      )}
    </div>
  );
}
