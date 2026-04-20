import { create } from 'zustand'
import type { AiSourceRef } from '../types'

/** 本地使用的轻量消息类型（不依赖数据库 ID） */
export interface LocalAiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sourceRefs: AiSourceRef[]
  timestamp: number
  isStreaming?: boolean
}

interface AiChatState {
  messages: LocalAiMessage[]
  isOpen: boolean
  isLoading: boolean
  hasNewMessage: boolean

  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  addMessage: (msg: LocalAiMessage) => void
  updateLastAssistantMessage: (content: string) => void
  finishStreaming: (sourceRefs?: AiSourceRef[]) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
  clearNewMessageFlag: () => void
}

export const useAiChatStore = create<AiChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  hasNewMessage: false,

  toggleSidebar: () =>
    set((state) => {
      if (!state.isOpen) {
        return { isOpen: true, hasNewMessage: false }
      }
      return { isOpen: false }
    }),

  openSidebar: () => set({ isOpen: true, hasNewMessage: false }),

  closeSidebar: () => set({ isOpen: false }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  updateLastAssistantMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages]
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant' && msgs[i].isStreaming) {
          msgs[i] = { ...msgs[i], content }
          break
        }
      }
      return { messages: msgs }
    }),

  finishStreaming: (sourceRefs) =>
    set((state) => {
      const msgs = [...state.messages]
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant' && msgs[i].isStreaming) {
          msgs[i] = {
            ...msgs[i],
            isStreaming: false,
            sourceRefs: sourceRefs ?? msgs[i].sourceRefs,
          }
          break
        }
      }
      return { messages: msgs, isLoading: false }
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () => set({ messages: [] }),

  clearNewMessageFlag: () => set({ hasNewMessage: false }),
}))
