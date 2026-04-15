import { useState, useEffect, useCallback } from 'react'
import { IMessage } from '@stomp/stompjs'
import { useWebSocket } from './useWebSocket'
import { messagesApi } from '../api/messages'
import { ChatMessage } from '../types/message'

export function useChat(offerId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { subscribe, unsubscribe, publish } = useWebSocket()

  useEffect(() => {
    setLoading(true)
    messagesApi.list(offerId).then((msgs) => {
      setMessages(msgs)
      setLoading(false)
    })

    const destination = `/topic/offers/${offerId}/chat`
    subscribe(destination, (msg: IMessage) => {
      const incoming: ChatMessage = JSON.parse(msg.body)
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev
        return [...prev, incoming]
      })
    })

    return () => unsubscribe(destination)
  }, [offerId, subscribe, unsubscribe])

  const sendMessage = useCallback(
    (content: string) => {
      publish(`/app/offers/${offerId}/chat`, { content })
    },
    [offerId, publish]
  )

  return { messages, loading, sendMessage }
}
