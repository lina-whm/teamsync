import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector"
import { apiClient } from "@/shared/api/base"
import type { User } from "@/entities/user"
import { $currentUser, loadSessionFx } from "@/entities/user"

export const profileEditOpened = createEvent()
export const profileEditClosed = createEvent()
export interface ProfileFormData {
  firstName: string
  lastName: string | null
  position: string | null
  department: string | null
  city: string | null
  workEmail: string | null
  workPhone: string | null
  avatar: string | null
}

export const profileFormSubmitted = createEvent<ProfileFormData>()

export const $profileDialogOpen = createStore(false)
  .on(profileEditOpened, () => true)
  .reset(profileEditClosed)

export const saveProfileFx = createEffect(
  async ({ id, ...data }: { id: string } & ProfileFormData) => {
    return apiClient<User>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },
)

$currentUser.on(saveProfileFx.doneData, (_, user) => user)

export const $savePending = saveProfileFx.pending

sample({
  clock: profileFormSubmitted,
  source: $currentUser,
  fn: (user, formData) => {
    if (!user) throw new Error("Not authenticated")
    return { id: user.id, ...formData }
  },
  target: saveProfileFx,
})

sample({
  clock: saveProfileFx.doneData,
  target: profileEditClosed,
})

sample({
  clock: saveProfileFx.doneData,
  target: loadSessionFx,
})
