import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Client-side read/unread state for demo notifications. This is purely a
 * UI convenience and is not synced to any backend.
 */
interface NotificationUiState {
  readIds: string[]
  isRead: (id: string) => boolean
  markRead: (id: string) => void
  markAllRead: (ids: string[]) => void
}

export const useNotificationStore = create<NotificationUiState>()(
  persist(
    (set, get) => ({
      readIds: [],
      isRead: (id) => get().readIds.includes(id),
      markRead: (id) =>
        set((state) =>
          state.readIds.includes(id)
            ? state
            : { readIds: [...state.readIds, id] },
        ),
      markAllRead: (ids) => set(() => ({ readIds: ids })),
    }),
    {
      name: 'caregrid-notifications',
      partialize: (state) => ({ readIds: state.readIds }),
    },
  ),
)