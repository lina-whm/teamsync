import NextAuth from "next-auth"
import type { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { db } from "./db"

declare module "next-auth" {
  interface User {
    role: string
  }
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

interface ExtendedToken {
  id?: string
  role?: string
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          return null
        }

        const isValid = await compare(
          credentials.password as string,
          user.password,
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const extended = token as ExtendedToken & typeof token
        extended.id = user.id
        extended.role = user.role
      }
      return token
    },
    session({ session, token }) {
      const extended = token as ExtendedToken & typeof token
      const userRecord = session.user as unknown as Record<string, unknown>
      if (extended.id) {
        userRecord.id = extended.id
      }
      if (extended.role) {
        userRecord.role = extended.role
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
