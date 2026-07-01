import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const selectFields = {
  id: true, email: true, name: true, firstName: true, lastName: true,
  avatar: true, position: true, department: true, city: true,
  workEmail: true, workPhone: true, role: true,
} as const

const UpdateUserSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно").optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  workEmail: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const user = await db.user.findUnique({
    where: { id },
    select: selectFields,
  })

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  if (session.user.id !== id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = UpdateUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data: Record<string, unknown> = { ...parsed.data }
  if (data.firstName !== undefined) {
    data.name = data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.firstName
  }

  const user = await db.user.update({
    where: { id },
    data,
    select: selectFields,
  })

  return NextResponse.json(user)
}
