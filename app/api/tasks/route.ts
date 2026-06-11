import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { CreateTaskSchema } from "@/entities/task"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const sprintId = searchParams.get("sprintId")
  const status = searchParams.get("status")
  const assigneeId = searchParams.get("assigneeId")
  const priority = searchParams.get("priority")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {}

  if (sprintId) {
    where.sprintId = sprintId
  }

  if (status && status !== "all") {
    where.status = status
  }
  if (assigneeId) {
    where.assigneeId = assigneeId
  }
  if (priority && priority !== "all") {
    where.priority = priority
  }
  if (search) {
    where.title = { contains: search }
  }

  const tasks = await db.task.findMany({
    where,
    include: {
      assignee: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: [{ status: "asc" }, { order: "asc" }],
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const parsed = CreateTaskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { sprintId: rawSprintId, ...data } = parsed.data
  const sprintId = rawSprintId || null

  const maxOrder = sprintId
    ? await db.task.aggregate({
        where: { sprintId },
        _max: { order: true },
      })
    : null

  const order = (maxOrder?._max.order ?? -1) + 1

  const task = await db.task.create({
    data: {
      ...data,
      order,
      sprintId,
      creatorId: session.user.id,
    },
    include: {
      assignee: {
        select: { id: true, name: true, avatar: true },
      },
    },
  })

  return NextResponse.json(task, { status: 201 })
}
