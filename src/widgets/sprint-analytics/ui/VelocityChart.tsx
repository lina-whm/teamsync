"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Sprint } from "@/entities/sprint"
import { Task } from "@/entities/task"

interface VelocityChartProps {
  sprints: Sprint[]
  tasksBySprint: Map<string, Task[]>
}

export function VelocityChart({ sprints, tasksBySprint }: VelocityChartProps) {
  const data = useMemo(() => {
    return sprints.map((sprint) => {
      const sprintTasks = tasksBySprint.get(sprint.id) ?? []
      const completedPoints = sprintTasks
        .filter((t) => t.status === "DONE")
        .reduce((sum, t) => sum + (t.storyPoints ?? 0), 0)
      const totalPoints = sprintTasks.reduce(
        (sum, t) => sum + (t.storyPoints ?? 0),
        0,
      )
      return {
        name: sprint.name,
        completed: completedPoints,
        total: totalPoints,
      }
    })
  }, [sprints, tasksBySprint])

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Velocity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#e5e7eb" name="Всего SP" />
          <Bar dataKey="completed" fill="#22c55e" name="Выполнено SP" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
