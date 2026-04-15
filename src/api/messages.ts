import client from './client'
import { ChatMessage } from '../types/message'

export const messagesApi = {
  list: (offerId: string) =>
    client.get<ChatMessage[]>(`/offers/${offerId}/messages`).then((r) => r.data),

  send: (offerId: string, content: string) =>
    client.post<ChatMessage>(`/offers/${offerId}/messages`, { content }).then((r) => r.data),

  markRead: (offerId: string) =>
    client.patch(`/offers/${offerId}/messages/read`),
}
