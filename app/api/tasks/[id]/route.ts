import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { UpdateTaskSchema } from "@/entities/task"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const task = await db.task.findUnique({
    where: { id },
    include: {
      assignee: {
        select: { id: true, name: true, avatar: true },
      },
      creator: {
        select: { id: true, name: true, avatar: true },
      },
    },
  })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.task.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const body = await req.json()

  const parsed = UpdateTaskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const task = await db.task.update({
    where: { id },
    data: parsed.data,
    include: {
      assignee: {
        select: { id: true, name: true, avatar: true },
      },
    },
  })

  return NextResponse.json(task)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const task = await db.task.findUnique({ where: { id } })
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  await db.task.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
