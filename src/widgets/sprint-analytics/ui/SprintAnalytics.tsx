"use client"

import { useMemo, useEffect } from "react"
import { useUnit } from "effector-react"
import { $activeSprint, getSprintsQuery } from "@/entities/sprint"
import { getTasksQuery, Task } from "@/entities/task"
import { BurndownChart } from "./BurndownChart"
import { VelocityChart } from "./VelocityChart"

export function SprintAnalytics() {
  const activeSprint = useUnit($activeSprint)
  const sprints = useUnit(getSprintsQuery.$data)
  const sprintsPending = useUnit(getSprintsQuery.$pending)
  const tasks = useUnit(getTasksQuery.$data)
  const tasksPending = useUnit(getTasksQuery.$pending)

  useEffect(() => {
    getSprintsQuery.start()
    getTasksQuery.start({ sprintId: "", filters: { status: "all", assigneeId: null, priority: "all", search: "" } })
  }, [])

  const taskList: Task[] = tasks ?? []

  const sprintMetrics = useMemo(() => {
    const sprintTasks = activeSprint
      ? taskList.filter((t) => t.sprintId === activeSprint.id)
      : taskList

    const total = sprintTasks.length
    const done = sprintTasks.filter((t) => t.status === "DONE").length
    const inProgress = sprintTasks.filter((t) => t.status === "IN_PROGRESS").length
    const review = sprintTasks.filter((t) => t.status === "REVIEW").length
    const backlog = sprintTasks.filter((t) => t.status === "BACKLOG").length
    const totalPoints = sprintTasks.reduce((sum, t) => sum + (t.storyPoints ?? 0), 0)
    const donePoints = sprintTasks
      .filter((t) => t.status === "DONE")
      .reduce((sum, t) => sum + (t.storyPoints ?? 0), 0)
    const completionRate = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0

    return { total, done, inProgress, review, backlog, totalPoints, donePoints, completionRate }
  }, [activeSprint, taskList])

  const tasksBySprint = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of taskList) {
      const sprintId = task.sprintId ?? ""
      const existing = map.get(sprintId) ?? []
      existing.push(task)
      map.set(sprintId, existing)
    }
    return map
  }, [taskList])

  const isLoading = sprintsPending || tasksPending

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">
        Аналитика{activeSprint ? ` — ${activeSprint.name}` : ""}
      </h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <MetricCard label="Всего задач" value={sprintMetrics.total} />
        <MetricCard label="Done" value={sprintMetrics.done} color="text-green-600" />
        <MetricCard label="In Progress" value={sprintMetrics.inProgress} color="text-blue-600" />
        <MetricCard label="Review" value={sprintMetrics.review} color="text-yellow-600" />
        <MetricCard label="Backlog" value={sprintMetrics.backlog} color="text-gray-600" />
        <MetricCard
          label="Готовность"
          value={`${sprintMetrics.completionRate}%`}
          color={sprintMetrics.completionRate >= 80 ? "text-green-600" : "text-orange-600"}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {activeSprint && (
          <BurndownChart
            sprint={activeSprint}
            tasks={taskList.filter((t) => t.sprintId === activeSprint.id)}
          />
        )}
        <VelocityChart sprints={sprints ?? []} tasksBySprint={tasksBySprint} />
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color ?? "text-gray-900"}`}>{value}</p>
    </div>
  )
}
