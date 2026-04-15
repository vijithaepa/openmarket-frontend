import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../types/message'

interface NotificationState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload)
      state.unreadCount += 1
    },
    clearUnread(state) {
      state.unreadCount = 0
    },
  },
})

export const { addNotification, clearUnread } = notificationSlice.actions
export default notificationSlice.reducer
