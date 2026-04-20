function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; 2026 长沙理工大学竞赛平台
          </p>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              关于我们
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              联系方式
            </a>
            <a
              href="https://www.csust.edu.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              教务处官网
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
