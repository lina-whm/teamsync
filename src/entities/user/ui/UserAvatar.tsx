"use client"

import { cn, getInitials } from "@/shared/lib/utils"
import type { User } from "../model/user.types"

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
}

interface UserAvatarProps {
  user?: Pick<User, "name" | "avatar"> | null
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={cn(
          "rounded-full object-cover ring-2 ring-white",
          sizeClasses[size],
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700 ring-2 ring-white",
        sizeClasses[size],
      )}
      title={user?.name ?? "Unknown"}
    >
      {user ? getInitials(user.name) : "?"}
    </div>
  )
}
