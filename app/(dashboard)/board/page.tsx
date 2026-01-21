"use client";

import { useState } from "react";
import { useGetTasksQuery, Task, useUpdateTaskMutation } from "@/store/api/tasksApi";
import { TaskCard } from "@/components/tasks/TaskCard";
import { AddTaskButton } from "@/components/tasks/TaskForm";
import { Loader2, Search, Filter } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  TouchSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardColumn } from "@/components/board/BoardColumn";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Task["priority"] | "all">("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag, allowing clicks
      },
    }),
    useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(active.data.current?.task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTask(null);

    if (!over) return;

    const activeTask = active.data.current?.task as Task;
    const overType = over.data.current?.type;
    const overStatus = over.data.current?.status || (over.data.current?.task as Task)?.status;

    if (!activeTask) return;

    // If dropped on a column or a task in a different column
    if (activeTask.status !== overStatus && overStatus) {
       // Optimistic update logic could go here, but RTK Query cache invalidation handles it
       try {
         await updateTask({
            id: activeTask.id,
            data: { status: overStatus as Task["status"] }
         }).unwrap();
       } catch (error) {
         console.error("Failed to update status", error);
       }
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("board.title") || "Board"}
          </h1>
          <p className="text-muted-foreground">
            {t("board.subtitle") || "Manage tasks by status"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] pl-9 bg-background/50 backdrop-blur-sm"
                />
            </div>
            <div className="flex bg-muted/50 p-1 rounded-lg backdrop-blur-sm border border-border/50">
                {(['all', 'low', 'medium', 'high'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            priorityFilter === p
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>
          <AddTaskButton />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 min-h-0 overflow-x-auto pb-4">
          <div className="grid gap-6 md:grid-cols-3 h-full min-w-[800px] md:min-w-0">
            <BoardColumn
              id="todo"
              title={t("tasks.status.todo") || "To Do"}
              tasks={tasksByStatus.todo}
              color="blue"
            />
            <BoardColumn
              id="in_progress"
              title={t("tasks.status.in_progress") || "In Progress"}
              tasks={tasksByStatus.in_progress}
              color="yellow"
            />
            <BoardColumn
              id="done"
              title={t("tasks.status.done") || "Done"}
              tasks={tasksByStatus.done}
              color="green"
            />
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 rotate-2 scale-105 cursor-grabbing">
                <TaskCard task={activeTask} className="shadow-2xl ring-2 ring-primary/20 rounded-xl" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
