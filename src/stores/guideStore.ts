import { create } from 'zustand'

/** 新手引导状态管理 */
interface GuideState {
  /** 是否已看过引导 */
  hasSeenGuide: boolean
  /** 是否正在显示引导 */
  showGuide: boolean

  /** 关闭引导并标记为已看 */
  dismissGuide: () => void

  /** 检查是否需要显示引导（首次登录时调用） */
  checkAndShowGuide: () => void
}

const GUIDE_STORAGE_KEY = 'competition-hub-v2:has-seen-guide'

/** 从 localStorage 读取引导状态 */
function readGuideStatus(): boolean {
  try {
    return localStorage.getItem(GUIDE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

/** 将引导状态写入 localStorage */
function writeGuideStatus(seen: boolean): void {
  try {
    localStorage.setItem(GUIDE_STORAGE_KEY, seen ? 'true' : 'false')
  } catch {
    console.warn('[Guide] 无法写入 localStorage')
  }
}

export const useGuideStore = create<GuideState>((set) => ({
  hasSeenGuide: readGuideStatus(),
  showGuide: false,

  dismissGuide: () => {
    writeGuideStatus(true)
    set({ hasSeenGuide: true, showGuide: false })
  },

  checkAndShowGuide: () => {
    const hasSeen = readGuideStatus()
    if (!hasSeen) {
      set({ showGuide: true })
    }
  },
}))
