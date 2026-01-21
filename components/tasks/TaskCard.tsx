"use client";

import { useState } from "react";
import { Task } from "@/store/api/tasksApi";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/store/api/tasksApi";
import { motion } from "framer-motion";
import { Trash2, Edit, CheckCircle, Circle, Clock, Calendar, Tag, User, Save, X, MoreVertical } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
      className
    )}>
      {children}
    </span>
  );
}

const priorityConfig = {
  low: {
    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    label: "Low"
  },
  medium: {
    color: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
    label: "Medium"
  },
  high: {
    color: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20",
    label: "High"
  },
};



interface TaskCardProps {
  task: Task;
  className?: string;
  onDeleteError?: (message: string) => void;
  showFullContent?: boolean;
}

export function TaskCard({ task, className, onDeleteError, showFullContent = false }: TaskCardProps) {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Edit State
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editPriority, setEditPriority] = useState<Task['priority']>(task.priority);

  const handleDelete = async () => {
    if (isDeleting) return;
    setDeleteError(null);
    try {
      await deleteTask(task.id).unwrap();
    } catch {
      const message = t("tasks.delete_error") || "Failed to delete task";
      setDeleteError(message);
      if (onDeleteError) onDeleteError(message);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    try {
      await updateTask({
        id: task.id,
        data: {
          title: editTitle,
          description: editDescription,
          priority: editPriority
        }
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (newStatus === task.status) return;
    await updateTask({ id: task.id, data: { status: newStatus } });
  };

  const statusOptions = [
    { id: 'todo', label: 'Todo', color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20' },
    { id: 'done', label: 'Done', color: 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20' }
  ] as const;

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';

  if (isEditing) {
    return (
      <div className={className}>
        <Card className="h-full border-primary/50 shadow-md">
          <CardHeader className="space-y-3 pb-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
              className="font-semibold text-lg h-9"
              autoFocus
            />
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(p)}
                  className={clsx(
                    "px-2 py-1 rounded-md text-xs font-medium border transition-colors",
                    editPriority === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:bg-accent"
                  )}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-2 border-t bg-muted/20">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isUpdating}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating || !editTitle.trim()}>
              {isUpdating ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <><Save className="h-4 w-4 mr-1" /> Save</>}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative"
      >
        <Card className={clsx(
          "h-full flex flex-col transition-all duration-200 border-border/60 hover:border-border hover:shadow-md",
          task.status === 'done' && "opacity-75 bg-muted/30"
        )}>
          <CardHeader className="pb-3 pt-4 px-4 space-y-0">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <SimpleBadge className={priorityConfig[task.priority].color}>
                    {priorityConfig[task.priority].label}
                  </SimpleBadge>
                  {task.status === 'done' && (
                    <span className="text-xs font-medium text-muted-foreground flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Done
                    </span>
                  )}
                </div>
                <h3 className={clsx(
                  "font-semibold leading-tight break-words pr-6",
                  task.status === 'done' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="flex-1 px-4 py-2 space-y-3">
            {task.description && (
              <p className={clsx(
                "text-sm text-muted-foreground break-words",
                !showFullContent && "line-clamp-3",
                task.status === 'done' && "line-through opacity-80"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1">
              {task.dueDate && (
                <div className={clsx(
                  "flex items-center gap-1.5 text-xs font-medium",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{dueDate?.toLocaleDateString()}</span>
                </div>
              )}

              {task.assignedTo && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>{task.assignedTo}</span>
                </div>
              )}
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="px-4 py-3 border-t bg-muted/5 flex flex-col gap-3 mt-auto">
            <Button
              variant={task.status === 'done' ? "outline" : "default"}
              size="sm"
              onClick={() => handleStatusChange(task.status === 'done' ? 'todo' : 'done')}
              disabled={isUpdating}
              className={clsx(
                "h-8 text-xs w-full transition-all",
                task.status === 'done' 
                  ? "bg-background hover:bg-muted text-muted-foreground border-dashed" 
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              )}
            >
              {task.status === 'done' ? (
                <>Mark as Todo</>
              ) : (
                <>Mark as Complete</>
              )}
            </Button>
            
            <div className="flex w-full rounded-md shadow-sm border border-border/50 bg-background/50 p-1 gap-1" role="group" aria-label="Task Status">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status.id)}
                  disabled={isUpdating}
                  aria-pressed={task.status === status.id}
                  className={clsx(
                    "flex-1 py-1 px-2 text-xs md:text-sm font-medium rounded transition-all duration-200 border",
                    task.status === status.id
                      ? status.color + " shadow-sm scale-[1.02]"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      {deleteError && (
        <div className="mt-2 text-xs text-destructive text-center font-medium">
          {deleteError}
        </div>
      )}
    </div>
  );
}
