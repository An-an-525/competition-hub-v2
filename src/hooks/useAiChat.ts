import { useCallback, useRef } from 'react'
import { streamChat } from '../lib/minimax'
import { useAiChatStore } from '../stores/aiChatStore'
import type { LocalAiMessage } from '../stores/aiChatStore'

/** 生成简单唯一 ID */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/**
 * AI 聊天 Hook - 封装发送消息、流式接收、滚动锁定逻辑
 */
export function useAiChat() {
  const {
    messages,
    isOpen,
    isLoading,
    hasNewMessage,
    addMessage,
    updateLastAssistantMessage,
    finishStreaming,
    setLoading,
    clearMessages,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    clearNewMessageFlag,
  } = useAiChatStore()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isUserNearBottomRef = useRef(true)
  const accumulatedContentRef = useRef('')
  const abortRef = useRef(false)

  /** 检测用户是否在滚动容器底部附近 */
  const checkNearBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100
  }, [])

  /** 智能滚动：仅在用户位于底部时自动滚动 */
  const scrollToBottom = useCallback(() => {
    if (isUserNearBottomRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  /** 发送消息 */
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      // 添加用户消息
      const userMsg: LocalAiMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        sourceRefs: [],
        timestamp: Date.now(),
      }
      addMessage(userMsg)

      // 添加空的 assistant 消息占位
      const assistantMsg: LocalAiMessage = {
        id: uid(),
        role: 'assistant',
        content: '',
        sourceRefs: [],
        timestamp: Date.now(),
        isStreaming: true,
      }
      addMessage(assistantMsg)

      setLoading(true)
      accumulatedContentRef.current = ''
      abortRef.current = false

      // 构建发送给 API 的消息历史（最近 20 条）
      const apiMessages = messages
        .filter((m) => !m.isStreaming)
        .slice(-20)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
      apiMessages.push({ role: 'user', content: trimmed })

      await streamChat(
        apiMessages,
        // onChunk
        (text) => {
          if (abortRef.current) return
          accumulatedContentRef.current += text
          updateLastAssistantMessage(accumulatedContentRef.current)
          scrollToBottom()
        },
        // onDone
        () => {
          finishStreaming()
          accumulatedContentRef.current = ''
        },
        // onError
        (error) => {
          updateLastAssistantMessage(
            `抱歉，发生了错误：${error.message}`,
          )
          finishStreaming()
          accumulatedContentRef.current = ''
        },
      )
    },
    [
      messages,
      isLoading,
      addMessage,
      setLoading,
      updateLastAssistantMessage,
      finishStreaming,
      scrollToBottom,
    ],
  )

  /** 处理滚动事件 - 实现滚动锁定 */
  const handleScroll = useCallback(() => {
    isUserNearBottomRef.current = checkNearBottom()
  }, [checkNearBottom])

  return {
    messages,
    isOpen,
    isLoading,
    hasNewMessage,
    sendMessage,
    clearMessages,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    clearNewMessageFlag,
    messagesEndRef,
    scrollContainerRef,
    handleScroll,
  }
}
