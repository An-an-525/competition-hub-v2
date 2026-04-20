import { Brain } from 'lucide-react'
import { clsx } from 'clsx'

interface AiFloatingButtonProps {
  visible: boolean
  hasNewMessage: boolean
  onClick: () => void
}

export default function AiFloatingButton({
  visible,
  hasNewMessage,
  onClick,
}: AiFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="打开 AI 助手"
      className={clsx(
        'fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full',
        'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg',
        'transition-all duration-300 hover:scale-110 hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none',
      )}
    >
      <Brain size={26} />

      {/* 新消息红点提示 */}
      {hasNewMessage && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
          !
        </span>
      )}
    </button>
  )
}
