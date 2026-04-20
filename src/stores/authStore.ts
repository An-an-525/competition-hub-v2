import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  /** 初始化 - 从 Supabase 获取当前会话 */
  initialize: () => Promise<void>

  /** 登录 (学号 + 密码) */
  login: (csustId: string, password: string) => Promise<void>

  /** 注册 */
  register: (data: {
    csustId: string
    password: string
    realName: string
    email?: string
  }) => Promise<void>

  /** 登出 */
  logout: () => Promise<void>

  /** 清除错误 */
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  initialize: async () => {
    set({ loading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // 从自定义 users 表获取用户信息
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('csust_id', session.user.email)
          .single()
        if (userData) {
          set({ user: userData as User })
        }
      }
    } catch (err) {
      console.error('[Auth] 初始化失败:', err)
    } finally {
      set({ loading: false })
    }
  },

  login: async (csustId: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: `${csustId}@csust.edu.cn`,
        password,
      })
      if (error) throw error

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('csust_id', csustId)
        .single()
      if (userData) {
        set({ user: userData as User })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败'
      set({ error: message })
    } finally {
      set({ loading: false })
    }
  },

  register: async ({ csustId, password, realName, email }) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signUp({
        email: `${csustId}@csust.edu.cn`,
        password,
      })
      if (error) throw error

      // 在自定义 users 表中创建记录
      const { error: insertError } = await supabase.from('users').insert({
        csust_id: csustId,
        real_name: realName,
        email: email ?? null,
      })
      if (insertError) throw insertError
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '注册失败'
      set({ error: message })
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))
