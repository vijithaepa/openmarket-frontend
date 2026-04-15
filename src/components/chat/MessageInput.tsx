import { useState } from 'react'
import { Send } from 'lucide-react'

export function MessageInput({ onSend }: { onSend: (content: string) => void }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-40"
      >
        <Send size={18} />
      </button>
    </div>
  )
}
