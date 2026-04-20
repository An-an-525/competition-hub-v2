import { Link, useNavigate } from 'react-router-dom'
import {
  Trophy,
  BookOpen,
  Users,
  Search,
  Brain,
  Target,
  CalendarClock,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Handshake,
  Milestone,
} from 'lucide-react'
import {
  getHotCompetitions,
  getCategoryLabel,
  getStatusLabel,
} from '@/data/mockCompetitions'
import { useGuideStore } from '@/stores/guideStore'
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
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
            categoryColor[String(competition.category_id)] ?? 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {getCategoryLabel(competition.category_id)}
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

// ---- 主页组件 ----
function Home() {
  const { checkAndShowGuide } = useGuideStore()
  const hotCompetitions = getHotCompetitions()

  const handleOpenGuide = () => {
    checkAndShowGuide()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== Hero 区域 ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* 装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            长沙理工大学
            <br />
            <span className="text-blue-200">学科竞赛智能平台</span>
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            一站式竞赛查询、报名、组队、备赛 — 让每一次参赛都有价值
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/competitions"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              <Search className="w-5 h-5" />
              浏览竞赛
            </Link>
            <button
              onClick={() => {
                // AI 侧边栏功能预留
                alert('AI 智能问答功能即将上线')
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500/30 text-white font-semibold rounded-lg border border-white/30 hover:bg-blue-500/50 transition-colors backdrop-blur-sm"
            >
              <Brain className="w-5 h-5" />
              AI 智能问答
            </button>
          </div>
        </div>
      </section>

      {/* ========== 快捷入口卡片 ========== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* 校赛直通车 */}
          <Link
            to="/competitions?filter=open"
            className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">校赛直通车</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">查看当前可报名的校内竞赛</p>
            </div>
          </Link>

          {/* 竞赛百科 */}
          <button
            onClick={handleOpenGuide}
            className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 group text-left w-full"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">竞赛百科</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">A/B类竞赛分类、创新学分认定办法</p>
            </div>
          </button>

          {/* 组队相亲角 */}
          <Link
            to="/competitions?tab=team"
            className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">组队相亲角</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">跨学院寻找最佳队友</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ========== 热门竞赛展示 ========== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">热门竞赛</h2>
            <p className="text-sm text-gray-500 mt-1">最受同学们关注的竞赛项目</p>
          </div>
          <Link
            to="/competitions"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {hotCompetitions.map((comp) => (
            <CompetitionCard key={comp.competition_id} competition={comp} />
          ))}
        </div>
      </section>

      {/* ========== 数据统计展示 ========== */}
      <section className="bg-white py-16 sm:py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '100+', label: '竞赛收录', icon: Trophy, color: 'text-amber-500' },
              { value: '5000+', label: '注册用户', icon: Users, color: 'text-blue-500' },
              { value: '85%', label: '获奖率', icon: Award, color: 'text-green-500' },
              { value: '50+', label: '合作协会', icon: Handshake, color: 'text-purple-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 平台特色 ========== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">平台特色</h2>
          <p className="text-sm text-gray-500 mt-2">为你的竞赛之旅提供全方位支持</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* AI 智能问答 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 智能问答</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              基于竞赛知识库的智能问答系统，随时解答你关于竞赛规则、报名流程、备赛策略等疑问，精准高效。
            </p>
          </div>

          {/* 跨学科组队推荐 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <Handshake className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">跨学科组队推荐</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              智能匹配算法根据你的专业、技能和兴趣，推荐最适合的队友，打破学院壁垒，组建最强战队。
            </p>
          </div>

          {/* 备赛里程碑引导 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
              <Milestone className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">备赛里程碑引导</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              为每个竞赛定制备赛时间线，自动提醒关键节点，从报名到答辩全程引导，不再错过任何截止日期。
            </p>
          </div>
        </div>
      </section>

      {/* ========== 底部 CTA ========== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            准备好开启你的竞赛之旅了吗？
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            立即浏览竞赛列表，找到属于你的舞台
          </p>
          <Link
            to="/competitions"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Target className="w-5 h-5" />
            立即探索
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
