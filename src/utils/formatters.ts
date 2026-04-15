import { format, formatDistanceToNow } from 'date-fns'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const formatDate = (iso: string) =>
  format(new Date(iso), 'MMM d, yyyy')

export const formatTime = (iso: string) =>
  format(new Date(iso), 'h:mm a')

export const formatRelative = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true })
