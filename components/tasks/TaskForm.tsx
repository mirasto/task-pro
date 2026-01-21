"use client";

import { useState } from "react";
import { useAddTaskMutation, Task } from "@/store/api/tasksApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "react-i18next";

export function AddTaskButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="h-auto min-h-10 whitespace-normal text-left py-2">
        <Plus className="mr-2 h-4 w-4 shrink-0" /> 
        <span className="break-words">{t("tasks.add_task")}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <TaskForm onClose={() => setIsOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function TaskForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [addTask, { isLoading }] = useAddTaskMutation();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    await addTask({
      title,
      description,
      priority,
      status,
    });
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("tasks.new_task")}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            placeholder={t("tasks.form.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            label={t("tasks.form.title")}
            disabled={isLoading}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("tasks.form.description")}</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t("tasks.form.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("tasks.form.priority")}</label>
              <div className="flex flex-wrap gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${priority === p
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("Tasks Status") || "Tasks Status"}</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todo', label: t("tasks.status.todo") || "To Do", color: 'border-blue-500 text-blue-600 bg-blue-50' },
                  { id: 'in_progress', label: t("tasks.status.in_progress") || "In Progress", color: 'border-amber-500 text-amber-600 bg-amber-50' },
                  { id: 'done', label: t("tasks.status.done") || "Done", color: 'border-green-500 text-green-600 bg-green-50' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id as Task['status'])}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all disabled:opacity-50 ${
                      status === s.id
                        ? `${s.color} ring-1 ring-offset-1 ring-offset-background`
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            {t("tasks.cancel")}
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !title.trim()}>
            {t("tasks.create_task")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
