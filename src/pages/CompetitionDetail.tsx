import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  User,
  Users,
  Star,
  Clock,
  Trophy,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { mockCompetitions, getMilestones, getCategoryLabel, getStatusLabel, getLevelLabel } from '@/data/mockCompetitions'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

/** 模拟当前用户信息 */
const MOCK_USER = {
  name: '张三',
  studentId: '202401010001',
  college: '计算机与人工智能学院',
  major: '计算机科学与技术',
  grade: 1,
  className: '计科2401班',
  phone: '13800138000',
  email: 'zhangsan@csust.edu.cn',
}

/** 学院名称映射 */
const COLLEGE_NAMES: Record<number, string> = {
  1: '数学与统计学院',
  2: '计算机与人工智能学院',
  3: '创新创业学院',
  4: '外国语学院',
  5: '物理与电子科学学院',
}

/** 获取状态对应的 Badge variant */
function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    upcoming: 'info',
    registration_open: 'success',
    in_progress: 'warning',
    judging: 'warning',
    completed: 'default',
    cancelled: 'danger',
  }
  return map[status] ?? 'default'
}

/** 获取分类对应的 Badge variant */
function getCategoryVariant(categoryId: number | null): 'purple' | 'info' {
  return categoryId === 1 ? 'purple' : 'info'
}

/** 获取级别对应的 Badge variant */
function getLevelVariant(level: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    school: 'success',
    provincial: 'warning',
    national: 'danger',
    international: 'info',
  }
  return map[level] ?? 'default'
}

/** 准入检测结果 */
function checkEligibility(competition: typeof mockCompetitions[0]) {
  const rules = competition.eligibility_rules
  const results: { type: 'success' | 'warning' | 'danger'; text: string }[] = []

  // 年级检查
  if (rules.min_grade && MOCK_USER.grade < rules.min_grade) {
    results.push({ type: 'danger', text: `不可参加：需要${rules.min_grade}年级及以上` })
  } else if (rules.max_grade && MOCK_USER.grade > rules.max_grade) {
    results.push({ type: 'danger', text: `不可参加：仅限${rules.max_grade}年级及以下` })
  }

  // 专业检查（模拟：如果竞赛有 allowed_majors 且不包含当前专业）
  if (rules.allowed_majors && rules.allowed_majors.length > 0) {
    if (!rules.allowed_majors.includes(MOCK_USER.major)) {
      results.push({ type: 'warning', text: '跨专业挑战：该竞赛对专业有限制' })
    }
  }

  // 跨学院检查
  const competitionCollege = competition.hosting_college_id
    ? COLLEGE_NAMES[competition.hosting_college_id]
    : null
  if (competitionCollege && competitionCollege !== MOCK_USER.college) {
    results.push({ type: 'warning', text: '跨专业挑战：承办学院非本学院' })
  }

  // 如果没有问题
  if (results.length === 0) {
    results.push({ type: 'success', text: '可以报名' })
  }

  return results
}

/** 星级评分组件 */
function DifficultyStars({ score }: { score: number }) {
  const normalizedScore = Math.min(10, Math.max(1, score))
  const fullStars = Math.round(normalizedScore / 2)
  const emptyStars = 5 - fullStars

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-amber-400 text-amber-400" />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">{score}/10</span>
    </div>
  )
}

/** 进度条组件 */
function ProgressBar({ value, max = 1, label }: { value: number; max?: number; label?: string }) {
  const percent = Math.round((value / max) * 100)

  return (
    <div className="w-full">
      {label && <p className="mb-1 text-sm text-gray-600">{label}</p>}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-gray-500">{percent}%</p>
    </div>
  )
}

function CompetitionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const competition = mockCompetitions.find((c) => c.competition_id === Number(id))

  if (!competition) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">竞赛未找到</h2>
          <p className="mt-2 text-gray-500">请检查链接是否正确</p>
          <Button className="mt-4" onClick={() => navigate('/competitions')}>
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  const milestones = getMilestones(competition.competition_id)
  const eligibilityResults = checkEligibility(competition)
  const canRegister = eligibilityResults.some((r) => r.type === 'success') && competition.status === 'registration_open'
  const isRegistrationClosed = competition.status === 'completed' || competition.status === 'cancelled'
  const hostingCollege = competition.hosting_college_id
    ? COLLEGE_NAMES[competition.hosting_college_id]
    : '未知'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            首页
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/competitions" className="hover:text-blue-600 transition-colors">
            竞赛列表
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{competition.name}</span>
        </nav>

        {/* 头部信息 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{competition.name}</h1>
          {competition.short_name && (
            <p className="mt-1 text-sm text-gray-500">简称：{competition.short_name}</p>
          )}

          {/* Badge 组 */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={getCategoryVariant(competition.category_id)}>
              {getCategoryLabel(competition.category_id)}
            </Badge>
            <Badge variant={getLevelVariant(competition.level)}>
              {getLevelLabel(competition.level)}
            </Badge>
            <Badge variant={getStatusVariant(competition.status)}>
              {getStatusLabel(competition.status)}
            </Badge>
          </div>

          {/* 承办信息 */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>承办：{hostingCollege}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 shrink-0 text-gray-400" />
              <span>负责人：{competition.contact_teacher ?? '暂无'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{competition.contact_phone ?? '暂无'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{competition.contact_location ?? '暂无'}</span>
            </div>
          </div>

          {/* 官方链接 */}
          {competition.official_url && (
            <div className="mt-4">
              <a
                href={competition.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                查看官方网站
              </a>
            </div>
          )}
        </div>

        {/* 准入要求检测 */}
        <Card className="mb-6" title="准入要求检测">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-1">
              当前身份：{MOCK_USER.college} / 大{MOCK_USER.grade}
            </span>
            {eligibilityResults.map((result, index) => (
              <Badge
                key={index}
                variant={result.type === 'success' ? 'success' : result.type === 'warning' ? 'warning' : 'danger'}
              >
                {result.type === 'success' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                {result.type === 'warning' && <AlertTriangle className="mr-1 h-3 w-3" />}
                {result.type === 'danger' && <XCircle className="mr-1 h-3 w-3" />}
                {result.text}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 核心信息卡片 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 报名时间 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h4 className="text-sm font-semibold text-gray-700">报名时间</h4>
            </div>
            <p className="text-sm text-gray-600">
              {competition.registration_start ?? '待定'} ~ {competition.registration_end ?? '待定'}
            </p>
          </Card>

          {/* 比赛时间 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h4 className="text-sm font-semibold text-gray-700">比赛时间</h4>
            </div>
            <p className="text-sm text-gray-600">
              {competition.event_start_date ?? '待定'} ~ {competition.event_end_date ?? '待定'}
            </p>
          </Card>

          {/* 团队规模 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <h4 className="text-sm font-semibold text-gray-700">团队规模</h4>
            </div>
            <p className="text-sm text-gray-600">
              {competition.eligibility_rules.team_size_min === competition.eligibility_rules.team_size_max
                ? `${competition.eligibility_rules.team_size_min} 人/队`
                : `${competition.eligibility_rules.team_size_min} ~ ${competition.eligibility_rules.team_size_max} 人/队`}
            </p>
          </Card>

          {/* 难度评分 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h4 className="text-sm font-semibold text-gray-700">难度评分</h4>
            </div>
            <DifficultyStars score={competition.difficulty_score} />
          </Card>

          {/* 往届获奖率 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <h4 className="text-sm font-semibold text-gray-700">往届获奖率</h4>
            </div>
            {competition.historical_win_rate !== null ? (
              <ProgressBar
                value={competition.historical_win_rate}
                label={`${(competition.historical_win_rate * 100).toFixed(0)}%`}
              />
            ) : (
              <p className="text-sm text-gray-400">暂无数据</p>
            )}
          </Card>

          {/* 平均备赛时长 */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <h4 className="text-sm font-semibold text-gray-700">平均备赛时长</h4>
            </div>
            <p className="text-sm text-gray-600">{competition.avg_prep_weeks} 周</p>
          </Card>
        </div>

        {/* 前置技能 */}
        {competition.prerequisite_skills.length > 0 && (
          <Card className="mb-6" title="前置技能">
            <div className="flex flex-wrap gap-2">
              {competition.prerequisite_skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* 竞赛描述 */}
        {competition.description && (
          <Card className="mb-6" title="竞赛描述">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {competition.description}
            </p>
          </Card>
        )}

        {/* 备赛里程碑 */}
        {milestones.length > 0 && (
          <Card className="mb-6" title="备赛里程碑">
            <div className="relative ml-4">
              {/* 时间轴线 */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-8">
                    {/* 时间轴圆点 */}
                    <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-white" />
                    {index === milestones.length - 1 && (
                      <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        第 {milestone.weekOffset} 周
                      </span>
                      <h4 className="text-sm font-semibold text-gray-800">{milestone.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
          {canRegister && (
            <Button size="lg" onClick={() => navigate(`/registration/${competition.competition_id}`)}>
              立即报名
            </Button>
          )}
          {isRegistrationClosed && (
            <Button size="lg" variant="secondary" disabled>
              报名已截止
            </Button>
          )}
          {!canRegister && !isRegistrationClosed && competition.status === 'registration_open' && (
            <Button size="lg" variant="secondary" disabled>
              暂不可报名
            </Button>
          )}
          {competition.status === 'upcoming' && (
            <Button size="lg" variant="secondary" disabled>
              报名未开始
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={() => navigate('/competitions')}>
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompetitionDetail
