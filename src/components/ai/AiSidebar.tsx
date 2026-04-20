import { useState, useRef, useCallback, useEffect } from 'react'
import { X, Send, Trash2, Brain, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import ChatMessage from './ChatMessage'
import { useAiChat } from '../../hooks/useAiChat'

export default function AiSidebar() {
  const {
    messages,
    isOpen,
    isLoading,
    sendMessage,
    clearMessages,
    closeSidebar,
    messagesEndRef,
    scrollContainerRef,
    handleScroll,
  } = useAiChat()

  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整 textarea 高度
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [input, adjustTextareaHeight])

  // 侧边栏打开时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      // 延迟聚焦，等待动画完成
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    sendMessage(trimmed)
    setInput('')
    // 重置 textarea 高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <>
      {/* 遮罩层 - 仅移动端 */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeSidebar}
      />

      {/* 侧边栏面板 */}
      <aside
        className={clsx(
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          'md:w-[400px]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">AI 竞赛助手</h2>
              <p className="text-[11px] text-gray-400">长沙理工大学</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="清空对话"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={closeSidebar}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="关闭"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 消息列表 */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <Brain size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">你好，我是 AI 竞赛助手</p>
                <p className="mt-1 text-xs text-gray-400">
                  可以问我关于学科竞赛、创新学分、报名流程等问题
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[260px]">
                {[
                  'A类竞赛有哪些？',
                  '创新学分怎么认定？',
                  '校赛报名流程是什么？',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      textareaRef.current?.focus()
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 py-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={clsx(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                input.trim() && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400',
              )}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-gray-400">
            Enter 发送 / Shift+Enter 换行
          </p>
        </div>
      </aside>
    </>
  )
}
