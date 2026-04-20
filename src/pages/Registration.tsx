import { useState, type FormEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  User,
  Phone,
  Mail,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  FileText,
} from 'lucide-react'
import { mockCompetitions, getCategoryLabel, getLevelLabel, getStatusLabel } from '@/data/mockCompetitions'
import type { RegistrationType } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

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

/** 模拟用户已通过的校赛（用于阶梯式报名锁判断） */
const MOCK_PASSED_SCHOOL_COMPETITIONS = [3, 13] // 已通过互联网+校赛

/** 队员信息 */
interface TeamMemberInfo {
  studentId: string
  name: string
  role: string
}

/** 表单验证错误 */
interface FormErrors {
  teamName?: string
  members?: string[]
  phone?: string
  email?: string
  remark?: string
}

/** 学号格式验证 */
function isValidStudentId(id: string): boolean {
  return /^\d{10,12}$/.test(id)
}

/** 手机号格式验证 */
function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/** 邮箱格式验证 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function Registration() {
  const { competitionId } = useParams<{ competitionId: string }>()
  const navigate = useNavigate()

  const competition = mockCompetitions.find((c) => c.competition_id === Number(competitionId))

  // 表单状态
  const [registrationType, setRegistrationType] = useState<RegistrationType>('individual')
  const [teamName, setTeamName] = useState('')
  const [isCrossCollege, setIsCrossCollege] = useState(false)
  const [members, setMembers] = useState<TeamMemberInfo[]>([
    { studentId: '', name: '', role: '' },
  ])
  const [phone, setPhone] = useState(MOCK_USER.phone)
  const [email, setEmail] = useState(MOCK_USER.email)
  const [remark, setRemark] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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

  // ---- 阶梯式报名锁逻辑 ----
  const isHigherLevel = competition.level === 'provincial' || competition.level === 'national' || competition.level === 'international'

  let schoolLockMessage: string | null = null
  if (isHigherLevel && competition.parent_competition_id !== null) {
    const parentCompetition = mockCompetitions.find(
      (c) => c.competition_id === competition.parent_competition_id,
    )
    if (parentCompetition) {
      const hasPassed = MOCK_PASSED_SCHOOL_COMPETITIONS.includes(parentCompetition.competition_id)
      if (!hasPassed) {
        schoolLockMessage = `请先参加校内选拔赛「${parentCompetition.name}」并通过审核，才能报名此${getLevelLabel(competition.level)}。`
      }
    }
  }

  const isLocked = schoolLockMessage !== null
  const isTeamRequired = competition.eligibility_rules.team_size_min !== undefined &&
    competition.eligibility_rules.team_size_min > 1
  const maxTeamSize = competition.eligibility_rules.team_size_max ?? 5

  // ---- 表单处理 ----
  function handleAddMember() {
    if (members.length >= maxTeamSize - 1) return // 减去队长
    setMembers([...members, { studentId: '', name: '', role: '' }])
  }

  function handleRemoveMember(index: number) {
    setMembers(members.filter((_, i) => i !== index))
  }

  function handleMemberChange(
    index: number,
    field: keyof TeamMemberInfo,
    value: string,
  ) {
    const updated = [...members]
    updated[index] = { ...updated[index], [field]: value }
    setMembers(updated)
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {}

    // 团队赛验证
    if (registrationType === 'team') {
      if (!teamName.trim()) {
        newErrors.teamName = '请输入团队名称'
      }
      const memberErrors: string[] = []
      members.forEach((member) => {
        const errs: string[] = []
        if (!member.studentId.trim()) errs.push('学号不能为空')
        else if (!isValidStudentId(member.studentId)) errs.push('学号格式不正确（10-12位数字）')
        if (!member.name.trim()) errs.push('姓名不能为空')
        if (!member.role.trim()) errs.push('角色不能为空')
        memberErrors.push(errs.join('；'))
      })
      if (memberErrors.some((e) => e)) {
        newErrors.members = memberErrors
      }
    }

    // 手机号验证
    if (!phone.trim()) {
      newErrors.phone = '手机号不能为空'
    } else if (!isValidPhone(phone)) {
      newErrors.phone = '手机号格式不正确'
    }

    // 邮箱验证
    if (!email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!isValidEmail(email)) {
      newErrors.email = '邮箱格式不正确'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccessModal(true)
  }

  function handleSuccessClose() {
    setShowSuccessModal(false)
    navigate(`/competitions/${competition!.competition_id}`)
  }

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
          <Link
            to={`/competitions/${competition.competition_id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {competition.short_name ?? competition.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">报名</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 左侧：报名表单 */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">竞赛报名</h1>

            {/* 阶梯式报名锁警告 */}
            {isLocked && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">报名受限</h3>
                    <p className="mt-1 text-sm text-red-600">{schoolLockMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={isLocked ? 'opacity-60 pointer-events-none' : ''}>
              {/* 报名类型 */}
              <Card className="mb-6" title="报名类型">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="registrationType"
                      value="individual"
                      checked={registrationType === 'individual'}
                      onChange={() => setRegistrationType('individual')}
                      disabled={isTeamRequired}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">个人赛</span>
                    {isTeamRequired && (
                      <span className="text-xs text-gray-400">（该竞赛要求团队参赛）</span>
                    )}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="registrationType"
                      value="team"
                      checked={registrationType === 'team'}
                      onChange={() => {
                        setRegistrationType('team')
                        if (isTeamRequired) return
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">团队赛</span>
                  </label>
                </div>
              </Card>

              {/* 团队信息 */}
              {registrationType === 'team' && (
                <Card className="mb-6" title="团队信息">
                  <div className="space-y-4">
                    <Input
                      label="团队名称"
                      placeholder="请输入团队名称"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      error={errors.teamName}
                    />

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCrossCollege}
                        onChange={(e) => setIsCrossCollege(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">跨学院组队</span>
                    </label>

                    {/* 队员信息 */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">
                          队员信息（不含队长，最多 {maxTeamSize - 1} 人）
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleAddMember}
                          disabled={members.length >= maxTeamSize - 1}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          添加队员
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {members.map((member, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-500">
                                队员 {index + 1}
                              </span>
                              {members.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(index)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <Input
                                placeholder="学号"
                                value={member.studentId}
                                onChange={(e) =>
                                  handleMemberChange(index, 'studentId', e.target.value)
                                }
                                error={errors.members?.[index]?.includes('学号') ? errors.members[index] : undefined}
                              />
                              <Input
                                placeholder="姓名"
                                value={member.name}
                                onChange={(e) =>
                                  handleMemberChange(index, 'name', e.target.value)
                                }
                              />
                              <Input
                                placeholder="角色（如：开发、设计）"
                                value={member.role}
                                onChange={(e) =>
                                  handleMemberChange(index, 'role', e.target.value)
                                }
                                error={errors.members?.[index]?.includes('角色') ? errors.members[index] : undefined}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* 个人信息（自动填充） */}
              <Card className="mb-6" title="个人信息">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="姓名" value={MOCK_USER.name} disabled />
                  <Input label="学号" value={MOCK_USER.studentId} disabled />
                  <Input label="学院" value={MOCK_USER.college} disabled />
                  <Input label="专业" value={MOCK_USER.major} disabled />
                  <Input label="年级" value={`大${MOCK_USER.grade}`} disabled />
                  <Input label="班级" value={MOCK_USER.className} disabled />
                  <Input
                    label="手机号"
                    icon={<Phone className="h-4 w-4" />}
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />
                  <Input
                    label="邮箱"
                    icon={<Mail className="h-4 w-4" />}
                    placeholder="请输入邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />
                </div>
              </Card>

              {/* 作品上传区域（预留） */}
              <Card className="mb-6" title="作品上传">
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10">
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-600">上传区域（暂未开放）</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {competition.requires_document_upload
                      ? '该竞赛需要上传文档，功能开发中...'
                      : '该竞赛无需上传文档'}
                  </p>
                </div>
              </Card>

              {/* 备注 */}
              <Card className="mb-6" title="备注">
                <Input
                  multiline
                  placeholder="如有特殊情况或需要说明的事项，请在此填写..."
                  rows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </Card>

              {/* 提交按钮 */}
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isLocked}
                >
                  {isSubmitting ? '提交中...' : '提交报名'}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </Button>
              </div>
            </form>
          </div>

          {/* 右侧：竞赛信息摘要 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card title="竞赛信息摘要">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {competition.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={competition.category_id === 1 ? 'purple' : 'info'}>
                      {getCategoryLabel(competition.category_id)}
                    </Badge>
                    <Badge variant="default">
                      {getLevelLabel(competition.level)}
                    </Badge>
                    <Badge variant="success">
                      {getStatusLabel(competition.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>承办：{competition.organizer_name ?? '暂无'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>负责人：{competition.contact_teacher ?? '暂无'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{competition.contact_phone ?? '暂无'}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">报名时间：</span>
                      <span>{competition.registration_start ?? '待定'}</span>
                      <span className="text-gray-400"> ~ </span>
                      <span>{competition.registration_end ?? '待定'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">比赛时间：</span>
                      <span>{competition.event_start_date ?? '待定'}</span>
                      <span className="text-gray-400"> ~ </span>
                      <span>{competition.event_end_date ?? '待定'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">团队规模：</span>
                      <span>
                        {competition.eligibility_rules.team_size_min ===
                        competition.eligibility_rules.team_size_max
                          ? `${competition.eligibility_rules.team_size_min} 人/队`
                          : `${competition.eligibility_rules.team_size_min} ~ ${competition.eligibility_rules.team_size_max} 人/队`}
                      </span>
                    </div>
                  </div>

                  {competition.prerequisite_skills.length > 0 && (
                    <>
                      <hr className="border-gray-200" />
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-gray-500">前置技能</p>
                        <div className="flex flex-wrap gap-1">
                          {competition.prerequisite_skills.map((skill) => (
                            <Badge key={skill} variant="default">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* 温馨提示 */}
              <Card className="mt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>请确认个人信息无误后再提交报名。</p>
                    <p>提交后如需修改，请联系竞赛负责人。</p>
                    <p>团队赛请确保所有队员信息准确。</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 成功弹窗 */}
      <Modal open={showSuccessModal} onClose={handleSuccessClose} title="报名成功">
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">报名提交成功</h3>
          <p className="mt-2 text-sm text-gray-500">
            您已成功报名「{competition.name}」，请等待审核结果。
          </p>
          <div className="mt-6">
            <Button onClick={handleSuccessClose}>查看竞赛详情</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Registration
