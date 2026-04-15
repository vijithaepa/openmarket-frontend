import { ChatMessage } from '../../types/message'
import { formatTime } from '../../utils/formatters'

interface Props {
  message: ChatMessage
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs text-gray-400 mb-0.5 ml-1">{message.sender.fullName}</span>
        )}
        <div
          className={`px-3 py-2 rounded-2xl text-sm ${
            isOwn
              ? 'bg-primary-600 text-white rounded-br-sm'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-xs text-gray-400 mt-0.5 mx-1">{formatTime(message.sentAt)}</span>
      </div>
    </div>
  )
}
