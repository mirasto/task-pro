"use client";

import { useState } from "react";

import { useGetTasksQuery } from "@/store/api/tasksApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { Loader2, TrendingUp, CheckCircle2, Clock, ListTodo, AlertCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = {
    todo: "#3B82F6",
    in_progress: "#F59E0B",
    done: "#10B981",
    overdue: "#EF4444",
};

export default function AnalyticsPage() {
    const { user, loading: authLoading } = useAppSelector((state) => state.auth);
    const { data: tasks, isLoading } = useGetTasksQuery(undefined, {
        skip: authLoading || !user,
    });
    const { t } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState<"all" | "todo" | "in_progress" | "done">("all");

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const totalTasks = tasks?.length || 0;
    const todoTasks = tasks?.filter((t) => t.status === "todo").length || 0;
    const inProgressTasks = tasks?.filter((t) => t.status === "in_progress").length || 0;
    const doneTasks = tasks?.filter((t) => t.status === "done").length || 0;

    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const priorityData = [
        { name: "High", value: tasks?.filter((t) => t.priority === "high").length || 0, fill: "#EF4444" },
        { name: "Medium", value: tasks?.filter((t) => t.priority === "medium").length || 0, fill: "#F59E0B" },
        { name: "Low", value: tasks?.filter((t) => t.priority === "low").length || 0, fill: "#10B981" },
    ];

    const statusData = [
        { name: "To Do", value: todoTasks, fill: COLORS.todo },
        { name: "In Progress", value: inProgressTasks, fill: COLORS.in_progress },
        { name: "Done", value: doneTasks, fill: COLORS.done },
    ];

    const filteredTasks =
        selectedStatus === "all"
            ? tasks || []
            : (tasks || []).filter((t) => t.status === selectedStatus);

    const stats = [
        {
            title: t("analytics.total_tasks") || "Total Tasks",
            value: totalTasks,
            icon: ListTodo,
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
        },
        {
            title: t("analytics.in_progress") || "In Progress",
            value: inProgressTasks,
            icon: Clock,
            gradient: "from-amber-500 to-amber-600",
            bgGradient: "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
        },
        {
            title: t("analytics.completed") || "Completed",
            value: doneTasks,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-emerald-600",
            bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
        },
        {
            title: t("analytics.completion_rate") || "Completion Rate",
            value: `${completionRate}%`,
            icon: Target,
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
        },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar animate-fade-in">
            <div className="flex flex-col space-y-8 pb-8">
            <div className="z-20 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-md border-b border-border/40">
                <div className="pt-4 pb-4 space-y-4">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-3">
                            <TrendingUp className="h-9 w-9 text-primary" />
                            {t("analytics.title") || "Analytics"}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {t("analytics.subtitle") || "Track your productivity and task statistics"}
                        </p>
                    </div>

                    <Card className="border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                {t("analytics.overall_progress") || "Overall progress"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 lg:grid-cols-2 items-center">
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t("analytics.overall_progress_details") ||
                                            "Detailed view of your task progress"}
                                    </p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-4xl md:text-5xl font-bold text-foreground">
                                                {completionRate}%
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {doneTasks} / {totalTasks}{" "}
                                                {t("analytics.total_tasks") || "Total tasks"}
                                            </div>
                                        </div>
                                    </div>
                                    <Progress
                                        value={completionRate}
                                        className="h-3"
                                        indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div className="rounded-lg bg-background/80 p-3 border border-border/60">
                                        <div className="text-muted-foreground">
                                            {t("tasks.status.todo") || "To do"}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-foreground">{todoTasks}</div>
                                    </div>
                                    <div className="rounded-lg bg-background/80 p-3 border border-border/60">
                                        <div className="text-muted-foreground">
                                            {t("tasks.status.in_progress") || "In progress"}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-foreground">
                                            {inProgressTasks}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-background/80 p-3 border border-border/60">
                                        <div className="text-muted-foreground">
                                            {t("tasks.status.done") || "Done"}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-foreground">{doneTasks}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-8 pt-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className={`bg-gradient-to-br ${stat.bgGradient} border-0 overflow-hidden relative group`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5" />
                                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-3xl font-bold text-foreground">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid gap-6 md:grid-cols-2">
                {/* Status Distribution */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {t("analytics.status_distribution") || "Task Status Distribution"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {totalTasks === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                                <p>No tasks yet</p>
                                <p className="text-sm">Create your first task to see analytics</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={false}
                                        labelLine={false}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Priority Distribution */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {t("analytics.priority_distribution") || "Priority Distribution"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {totalTasks === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                                <p>No tasks yet</p>
                                <p className="text-sm">Create your first task to see analytics</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={priorityData} layout="vertical">
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {t("analytics.recent_activity") || "Recent activity"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {[
                                        {
                                            id: "all" as const,
                                            label: t("analytics.filter_all") || "Усі",
                                            icon: TrendingUp,
                                        },
                                        {
                                            id: "todo" as const,
                                            label: t("analytics.filter_todo") || "To do",
                                            icon: ListTodo,
                                        },
                                        {
                                            id: "in_progress" as const,
                                            label: t("analytics.filter_in_progress") || "In progress",
                                            icon: Clock,
                                        },
                                        {
                                            id: "done" as const,
                                            label: t("analytics.filter_done") || "Done",
                                            icon: CheckCircle2,
                                        },
                                    ].map((filter) => {
                                        const Icon = filter.icon;
                                        const isActive = selectedStatus === filter.id;
                                        return (
                                            <Button
                                                key={filter.id}
                                                type="button"
                                                variant={isActive ? "default" : "outline"}
                                                size="sm"
                                                className="h-9 min-w-[96px] px-3 text-xs flex items-center justify-center gap-2 transition-transform duration-200 hover:translate-y-[1px] active:translate-y-[2px]"
                                                onClick={() => setSelectedStatus(filter.id)}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                <span>{filter.label}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                {filteredTasks.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">
                                        {t("analytics.no_tasks_for_filter") ||
                                            "No tasks for this filter yet"}
                                    </p>
                                ) : (
                                    filteredTasks
                                        .slice(0, 6)
                                        .map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between rounded-md bg-background/80 border border-border/60 px-3 py-2 text-xs"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-muted-foreground truncate">
                                                        {task.description}
                                                    </div>
                                                </div>
                                                <div className="ml-3 flex flex-col items-end gap-1">
                                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
                                                        {t("tasks.status." + task.status) ||
                                                            task.status}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                </CardContent>
            </Card>
            </div>
            </div>
        </div>
    );
}
