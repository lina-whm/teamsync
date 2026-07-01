import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector"
import { apiClient } from "@/shared/api/base"
import { $currentUser, loadSessionFx } from "@/entities/user"

export const profileEditOpened = createEvent()
export const profileEditClosed = createEvent()
export const profileFormSubmitted = createEvent<{ name: string; avatar: string }>()

export const $profileDialogOpen = createStore(false)
  .on(profileEditOpened, () => true)
  .reset(profileEditClosed)

export const saveProfileFx = createEffect(
  async ({ id, name, avatar }: { id: string; name: string; avatar: string }) => {
    return apiClient<unknown>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, avatar: avatar || null }),
    })
  },
)

export const $savePending = saveProfileFx.pending

sample({
  clock: profileFormSubmitted,
  source: $currentUser,
  fn: (user, formData) => {
    if (!user) throw new Error("Not authenticated")
    return { id: user.id, name: formData.name, avatar: formData.avatar }
  },
  target: saveProfileFx,
})

sample({
  clock: saveProfileFx.doneData,
  target: profileEditClosed,
})

sample({
  clock: saveProfileFx.doneData,
  fn: () => loadSessionFx(),
  target: loadSessionFx,
})
