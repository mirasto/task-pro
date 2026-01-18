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
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> {t("tasks.add_task")}
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
  const [addTask, { isLoading }] = useAddTaskMutation();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    await addTask({
      title,
      description,
      priority,
      status: 'todo',
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t("tasks.form.priority")}</label>
            <div className="flex gap-2">
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
