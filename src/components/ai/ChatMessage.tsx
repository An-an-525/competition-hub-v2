import { clsx } from 'clsx'
import { User, Bot, ExternalLink } from 'lucide-react'
import type { LocalAiMessage } from '../../stores/aiChatStore'

interface ChatMessageProps {
  message: LocalAiMessage
}

/**
 * 简单 Markdown 渲染（支持加粗、链接、行内代码、列表）
 * 不引入额外 Markdown 库
 */
function renderSimpleMarkdown(text: string): string {
  let html = text
    // 转义 HTML 特殊字符
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 加粗 **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // 行内代码 `code`
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-200 rounded text-sm font-mono">$1</code>')
  // 链接 [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>',
  )
  // 无序列表行 - * item
  html = html.replace(/^\*\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  // 有序列表行 - 1. item
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')

  // 换行
  html = html.replace(/\n/g, '<br/>')

  return html
}

/** 格式化时间戳 */
function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={clsx('flex gap-3 px-4 py-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* 头像 */}
      <div
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* 消息体 */}
      <div className={clsx('flex max-w-[85%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={clsx(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-blue-600 text-white rounded-tr-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-tl-md shadow-sm',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div
              className="prose-sm"
              dangerouslySetInnerHTML={{
                __html: renderSimpleMarkdown(message.content),
              }}
            />
          )}

          {/* 流式输出时的光标闪烁 */}
          {message.isStreaming && (
            <span className="inline-block ml-0.5 w-1.5 h-4 bg-blue-500 animate-pulse rounded-sm" />
          )}
        </div>

        {/* 来源引用 */}
        {message.sourceRefs.length > 0 && !message.isStreaming && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.sourceRefs.map((ref, idx) => (
              <a
                key={idx}
                href={ref.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-700 hover:bg-amber-100 transition-colors"
                title={ref.text}
              >
                <ExternalLink size={10} />
                <span>{ref.text}</span>
              </a>
            ))}
          </div>
        )}

        {/* 时间戳 */}
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
