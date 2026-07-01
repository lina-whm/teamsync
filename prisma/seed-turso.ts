import { PrismaClient } from "@prisma/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { createClient } from "@libsql/client"
import { hash } from "bcryptjs"
import { v4 as uuid } from "uuid"

const TURSO_URL = process.env.TURSO_DATABASE_URL
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN

function createDb() {
  if (TURSO_URL && TURSO_TOKEN) {
    const libsql = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  }
  return new PrismaClient()
}

const prisma = createDb()

async function main() {
  console.log("Seeding Turso database...")

  await prisma.task.deleteMany()
  await prisma.sprint.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  const password = await hash("password123", 12)

  const admin = await prisma.user.create({
    data: {
      id: uuid(),
      email: "admin@teamsync.dev",
      name: "Admin",
      firstName: "Admin",
      password,
      role: "ADMIN",
      position: "Project Manager",
      department: "Management",
      city: "Moscow",
    },
  })

  const alice = await prisma.user.create({
    data: {
      id: uuid(),
      email: "alice@teamsync.dev",
      name: "Alice Johnson",
      firstName: "Alice",
      lastName: "Johnson",
      password,
      role: "MEMBER",
      position: "Frontend Developer",
      department: "Engineering",
      city: "Saint Petersburg",
      workEmail: "alice@company.ru",
      workPhone: "+7-999-111-22-33",
    },
  })

  const bob = await prisma.user.create({
    data: {
      id: uuid(),
      email: "bob@teamsync.dev",
      name: "Bob Smith",
      firstName: "Bob",
      lastName: "Smith",
      password,
      role: "MEMBER",
      position: "Backend Developer",
      department: "Engineering",
      city: "Novosibirsk",
      workEmail: "bob@company.ru",
      workPhone: "+7-999-444-55-66",
    },
  })

  const sprint1 = await prisma.sprint.create({
    data: {
      id: uuid(),
      name: "Sprint 1",
      goal: "MVP Core Features",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-05-31"),
      status: "COMPLETED",
    },
  })

  const sprint2 = await prisma.sprint.create({
    data: {
      id: uuid(),
      name: "Sprint 2",
      goal: "Dashboard & Analytics",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-30"),
      status: "ACTIVE",
    },
  })

  const sprint1Tasks = [
    { title: "Setup project infrastructure", status: "DONE", priority: "HIGH", assigneeId: admin.id, creatorId: admin.id, order: 1, storyPoints: 3 },
    { title: "Design database schema", status: "DONE", priority: "HIGH", assigneeId: alice.id, creatorId: admin.id, order: 2, storyPoints: 5 },
    { title: "Implement authentication", status: "DONE", priority: "CRITICAL", assigneeId: bob.id, creatorId: admin.id, order: 3, storyPoints: 8 },
    { title: "Create project board UI", status: "DONE", priority: "HIGH", assigneeId: alice.id, creatorId: bob.id, order: 4, storyPoints: 5 },
    { title: "Implement task CRUD API", status: "DONE", priority: "HIGH", assigneeId: bob.id, creatorId: alice.id, order: 5, storyPoints: 8 },
    { title: "Write unit tests", status: "REVIEW", priority: "MEDIUM", assigneeId: alice.id, creatorId: admin.id, order: 6, storyPoints: 3 },
    { title: "Performance optimization", status: "REVIEW", priority: "MEDIUM", assigneeId: bob.id, creatorId: alice.id, order: 7, storyPoints: 5 },
  ]

  const sprint2Tasks = [
    { title: "Implement drag and drop", status: "DONE", priority: "HIGH", assigneeId: alice.id, creatorId: admin.id, order: 1, storyPoints: 8 },
    { title: "Add sprint analytics", status: "DONE", priority: "MEDIUM", assigneeId: bob.id, creatorId: admin.id, order: 2, storyPoints: 5 },
    { title: "Filter and search tasks", status: "REVIEW", priority: "MEDIUM", assigneeId: alice.id, creatorId: bob.id, order: 3, storyPoints: 3 },
    { title: "Burndown chart component", status: "REVIEW", priority: "HIGH", assigneeId: bob.id, creatorId: admin.id, order: 4, storyPoints: 5 },
    { title: "User profile page", status: "IN_PROGRESS", priority: "LOW", assigneeId: admin.id, creatorId: admin.id, order: 5, storyPoints: 3 },
    { title: "Notifications system", status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: alice.id, creatorId: bob.id, order: 6, storyPoints: 8 },
    { title: "Email reports", status: "BACKLOG", priority: "LOW", assigneeId: null, creatorId: admin.id, order: 7, storyPoints: 5 },
    { title: "Mobile responsive layout", status: "BACKLOG", priority: "MEDIUM", assigneeId: null, creatorId: alice.id, order: 8, storyPoints: 3 },
  ]

  for (const task of sprint1Tasks) {
    await prisma.task.create({
      data: { id: uuid(), ...task, sprintId: sprint1.id },
    })
  }

  for (const task of sprint2Tasks) {
    await prisma.task.create({
      data: { id: uuid(), ...task, sprintId: sprint2.id },
    })
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
