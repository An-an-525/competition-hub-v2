import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Trophy, Search, Menu, X, User, Moon } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/competitions', label: '竞赛大全' },
  { to: '/ai', label: 'AI问答' },
  { to: '/team', label: '组队相亲角' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 关闭移动菜单
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 bg-white transition-shadow duration-200',
        scrolled && 'shadow-sm',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">竞赛助手</span>
        </NavLink>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="搜索"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* 主题切换（预留） */}
          <button
            className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:block"
            aria-label="切换主题"
          >
            <Moon className="h-5 w-5" />
          </button>

          {/* 登录/头像按钮 */}
          <button className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:block">
            <User className="h-5 w-5" />
          </button>

          {/* 移动端汉堡菜单 */}
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单面板 */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
                <User className="h-4 w-4" />
                登录 / 注册
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
