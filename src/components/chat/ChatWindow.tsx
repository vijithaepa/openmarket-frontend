import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useChat } from '../../hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { LoadingSpinner } from '../common/LoadingSpinner'

export function ChatWindow({ offerId }: { offerId: string }) {
  const { messages, loading, sendMessage } = useChat(offerId)
  const { user } = useSelector((s: RootState) => s.auth)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) return <LoadingSpinner />

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 rounded-lg min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender.id === user?.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-2">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}
