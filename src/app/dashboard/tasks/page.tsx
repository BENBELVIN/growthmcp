import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { recentTasks } from "@/lib/data/dashboard";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <>
      <DashboardHeader title="Tasks" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Growth backlog</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Synced from get_growth_tasks() · agents can claim and complete items
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="divide-y divide-border">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {task.assignee} · due {task.due}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    task.status === "Done"
                      ? "bg-success/15 text-success"
                      : task.status === "In progress"
                        ? "bg-brand/15 text-brand"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
