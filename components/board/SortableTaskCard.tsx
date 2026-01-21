"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/store/api/tasksApi";
import { TaskCard } from "@/components/tasks/TaskCard";
import { clsx } from "clsx";

interface SortableTaskCardProps {
  task: Task;
  className?: string;
}

export function SortableTaskCard({ task, className }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={clsx(className, "opacity-30 grayscale")}
      >
        <TaskCard task={task} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(className, "touch-none")}
    >
      <TaskCard task={task} />
    </div>
  );
}
