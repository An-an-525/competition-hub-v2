import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AiFloatingButton from '../ai/AiFloatingButton'
import AiSidebar from '../ai/AiSidebar'
import { useAiChatStore } from '../../stores/aiChatStore'

function Layout() {
  const { isOpen, hasNewMessage, toggleSidebar } = useAiChatStore()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* AI 悬浮按钮 - 侧边栏收起时显示 */}
      <AiFloatingButton
        visible={!isOpen}
        hasNewMessage={hasNewMessage}
        onClick={toggleSidebar}
      />

      {/* AI 侧边栏 */}
      <AiSidebar />
    </div>
  )
}

export default Layout
