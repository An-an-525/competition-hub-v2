import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  CalendarClock,
  Star,
  TrendingUp,
  ArrowRight,
  Filter,
  X,
  Flame,
  Inbox,
} from 'lucide-react'
import {
  mockCompetitions,
  getCategoryLabel,
  getStatusLabel,
  getLevelLabel,
} from '@/data/mockCompetitions'
import type { Competition } from '@/types'

// ---- 竞赛卡片组件 ----
function CompetitionCard({ competition }: { competition: Competition }) {
  const navigate = useNavigate()

  const statusColor: Record<string, string> = {
    registration_open: 'bg-green-100 text-green-700',
    upcoming: 'bg-amber-100 text-amber-700',
    completed: 'bg-gray-100 text-gray-500',
    in_progress: 'bg-blue-100 text-blue-700',
    judging: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-500',
  }

  const categoryColor: Record<string, string> = {
    '1': 'bg-red-50 text-red-600 border-red-200',
    '2': 'bg-blue-50 text-blue-600 border-blue-200',
  }

  return (
    <div
      onClick={() => navigate(`/competitions/${competition.competition_id}`)}
      className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* 顶部标签 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
            categoryColor[String(competition.category_id)] ?? 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {getCategoryLabel(competition.category_id)}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600`}
        >
          {getLevelLabel(competition.level)}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            statusColor[competition.status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {getStatusLabel(competition.status)}
        </span>
      </div>

      {/* 竞赛名称 */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {competition.name}
      </h3>

      {/* 描述 */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
        {competition.description}
      </p>

      {/* 标签 */}
      {competition.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {competition.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CalendarClock className="w-3.5 h-3.5" />
            {competition.registration_end
              ? `截止 ${competition.registration_end.slice(5)}`
              : '待定'}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {competition.historical_win_rate
              ? `${Math.round(competition.historical_win_rate * 100)}%`
              : '-'}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {competition.difficulty_score}/5
          </span>
        </div>
        <span className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
          详情 <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  )
}

// ---- 筛选选项类型 ----
type CategoryFilter = 'all' | 'A' | 'B'
type LevelFilter = 'all' | 'school' | 'provincial' | 'national' | 'international'
type StatusFilter = 'all' | 'registration_open' | 'upcoming' | 'completed'
type SortOption = 'deadline' | 'popularity' | 'difficulty'

// ---- 筛选按钮组件 ----
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

// ---- 主组件 ----
function Competitions() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 从 URL 参数初始化筛选状态
  const initialFilter = searchParams.get('filter')

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    initialFilter === 'open' ? 'registration_open' : 'all',
  )
  const [sortBy, setSortBy] = useState<SortOption>('popularity')
  const [showFilters, setShowFilters] = useState(false)

  // 处理 URL 参数变化
  useMemo(() => {
    if (initialFilter === 'open') {
      setStatusFilter('registration_open')
    }
  }, [initialFilter])

  // 筛选和排序逻辑
  const filteredCompetitions = useMemo(() => {
    let result = [...mockCompetitions]

    // 搜索
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.short_name?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query)),
      )
    }

    // 分类筛选
    if (categoryFilter === 'A') {
      result = result.filter((c) => c.category_id === 1)
    } else if (categoryFilter === 'B') {
      result = result.filter((c) => c.category_id === 2)
    }

    // 级别筛选
    if (levelFilter !== 'all') {
      result = result.filter((c) => c.level === levelFilter)
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    // 排序
    switch (sortBy) {
      case 'deadline':
        result.sort((a, b) => {
          if (!a.registration_end) return 1
          if (!b.registration_end) return -1
          return a.registration_end.localeCompare(b.registration_end)
        })
        break
      case 'popularity':
        result.sort((a, b) => b.popularity_score - a.popularity_score)
        break
      case 'difficulty':
        result.sort((a, b) => b.difficulty_score - a.difficulty_score)
        break
    }

    return result
  }, [searchQuery, categoryFilter, levelFilter, statusFilter, sortBy])

  // 清除所有筛选
  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setLevelFilter('all')
    setStatusFilter('all')
    setSortBy('popularity')
    setSearchParams({})
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    levelFilter !== 'all' ||
    statusFilter !== 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">竞赛列表</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">竞赛列表</h1>
          <p className="text-sm text-gray-500 mt-2">
            浏览所有竞赛，找到适合你的比赛
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 搜索栏 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索竞赛名称、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            筛选
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-5">
            {/* 分类筛选 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                竞赛分类
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="全部"
                  active={categoryFilter === 'all'}
                  onClick={() => setCategoryFilter('all')}
                />
                <FilterButton
                  label="A类"
                  active={categoryFilter === 'A'}
                  onClick={() => setCategoryFilter('A')}
                />
                <FilterButton
                  label="B类"
                  active={categoryFilter === 'B'}
                  onClick={() => setCategoryFilter('B')}
                />
              </div>
            </div>

            {/* 级别筛选 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                竞赛级别
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="全部"
                  active={levelFilter === 'all'}
                  onClick={() => setLevelFilter('all')}
                />
                <FilterButton
                  label="校赛"
                  active={levelFilter === 'school'}
                  onClick={() => setLevelFilter('school')}
                />
                <FilterButton
                  label="省赛"
                  active={levelFilter === 'provincial'}
                  onClick={() => setLevelFilter('provincial')}
                />
                <FilterButton
                  label="国赛"
                  active={levelFilter === 'national'}
                  onClick={() => setLevelFilter('national')}
                />
                <FilterButton
                  label="国际赛"
                  active={levelFilter === 'international'}
                  onClick={() => setLevelFilter('international')}
                />
              </div>
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                报名状态
              </label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="全部"
                  active={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                />
                <FilterButton
                  label="报名中"
                  active={statusFilter === 'registration_open'}
                  onClick={() => setStatusFilter('registration_open')}
                />
                <FilterButton
                  label="即将开始"
                  active={statusFilter === 'upcoming'}
                  onClick={() => setStatusFilter('upcoming')}
                />
                <FilterButton
                  label="已结束"
                  active={statusFilter === 'completed'}
                  onClick={() => setStatusFilter('completed')}
                />
              </div>
            </div>

            {/* 清除筛选 */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  清除所有筛选
                </button>
              </div>
            )}
          </div>
        )}

        {/* 排序和结果计数 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            共找到 <span className="font-semibold text-gray-900">{filteredCompetitions.length}</span> 个竞赛
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序:</span>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() => setSortBy('popularity')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'popularity'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                热度
              </button>
              <button
                onClick={() => setSortBy('deadline')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'deadline'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                截止日期
              </button>
              <button
                onClick={() => setSortBy('difficulty')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sortBy === 'difficulty'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                难度
              </button>
            </div>
          </div>
        </div>

        {/* 竞赛列表 */}
        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCompetitions.map((comp) => (
              <CompetitionCard key={comp.competition_id} competition={comp} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              没有找到匹配的竞赛
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              试试调整筛选条件，或者清除所有筛选查看全部竞赛
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              清除筛选
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Competitions
