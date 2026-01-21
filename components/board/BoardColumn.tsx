"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/store/api/tasksApi";
import { SortableTaskCard } from "./SortableTaskCard";
import { clsx } from "clsx";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAddTaskMutation } from "@/store/api/tasksApi";
import { Input } from "@/components/ui/Input";

interface BoardColumnProps {
  id: Task["status"];
  title: string;
  tasks: Task[];
  color?: "blue" | "yellow" | "green";
}

export function BoardColumn({ id, title, tasks, color = "blue" }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
  });
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addTask, { isLoading }] = useAddTaskMutation();

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await addTask({
        title: newTaskTitle,
        status: id,
        priority: "medium",
      }).unwrap();
      setNewTaskTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const colorStyles = {
    blue: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200/50 dark:border-blue-800/30",
    yellow: "bg-yellow-50/50 dark:bg-yellow-950/10 border-yellow-200/50 dark:border-yellow-800/30",
    green: "bg-green-50/50 dark:bg-green-950/10 border-green-200/50 dark:border-green-800/30",
  };

  const headerColors = {
    blue: "text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/20",
    yellow: "text-yellow-700 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/20",
    green: "text-green-700 dark:text-green-400 bg-green-100/50 dark:bg-green-900/20",
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-full flex-col rounded-xl border backdrop-blur-sm transition-colors",
        colorStyles[color],
        isOver && "bg-accent/50 ring-2 ring-primary/20"
      )}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 backdrop-blur-md rounded-t-xl border-b border-border/10">
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "flex h-6 min-w-[24px] items-center justify-center rounded-full text-xs font-semibold",
              headerColors[color]
            )}
          >
            {tasks.length}
          </span>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <div className="px-4 pt-4 pb-0">
          <form onSubmit={handleQuickAdd} className="flex flex-col gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={t("tasks.quick_add_placeholder") || "New task title..."}
              autoFocus
              className="bg-background/80 backdrop-blur-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!newTaskTitle.trim() || isLoading}
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 min-h-[100px]">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && !isAdding && (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/10 bg-muted/5">
                <p className="text-sm text-muted-foreground">
                  {t("board.drag_here") || "Drop tasks here"}
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
