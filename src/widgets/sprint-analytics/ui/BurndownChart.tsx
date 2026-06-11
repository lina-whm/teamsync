"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Task, TaskStatus } from "@/entities/task"
import { Sprint } from "@/entities/sprint"

interface BurndownChartProps {
  sprint: Sprint
  tasks: Task[]
}

export function BurndownChart({ sprint, tasks }: BurndownChartProps) {
  const data = useMemo(() => {
    const start = new Date(sprint.startDate)
    const end = new Date(sprint.endDate)
    const totalDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    )
    const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints ?? 0), 0)

    const days: { day: string; ideal: number; actual: number }[] = []
    let remainingPoints = totalPoints
    const remainingByDay = new Map<string, number>()

    const tasksByStatus = tasks.filter((t) => t.status !== "DONE")
    const actualStartPoints = tasksByStatus.reduce(
      (sum, t) => sum + (t.storyPoints ?? 0),
      0,
    )

    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      const key = date.toISOString().split("T")[0]
      const ideal = totalPoints - (totalPoints / totalDays) * i
      remainingByDay.set(key, actualStartPoints)
    }

    const sortedTasks = [...tasks].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    for (const task of sortedTasks) {
      if (task.storyPoints && task.status === "DONE") {
        const doneDate = new Date(task.updatedAt).toISOString().split("T")[0]
        for (const [key, value] of remainingByDay) {
          if (key >= doneDate) {
            remainingByDay.set(key, value - task.storyPoints)
          }
        }
      }
    }

    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      const key = date.toISOString().split("T")[0]
      days.push({
        day: `${i}`,
        ideal: Math.round((totalPoints - (totalPoints / totalDays) * i) * 10) / 10,
        actual: Math.max(0, remainingByDay.get(key) ?? 0),
      })
    }

    return days
  }, [sprint, tasks])

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Burndown Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            name="Идеальная"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            name="Фактическая"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
