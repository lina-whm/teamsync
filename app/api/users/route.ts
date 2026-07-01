import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await db.user.findMany({
    select: {
      id: true, email: true, name: true, firstName: true, lastName: true,
      avatar: true, position: true, department: true, city: true,
      workEmail: true, workPhone: true, role: true,
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(users)
}
