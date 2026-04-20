// ============================================================
// 长沙理工大学学科竞赛数智化平台 - 核心类型定义
// 版本: v2.0 | 对应数据库 Schema: csust_competition_v2_schema.sql
// ============================================================

// ---- 第一层: 基础数据域 (Foundation) ----

/** 学院 */
export interface College {
  college_id: number
  college_name: string
  college_code: string | null
  dean_name: string | null
  contact_phone: string | null
  created_at: string
}

/** 专业 */
export interface Major {
  major_id: number
  major_name: string
  major_code: string | null
  college_id: number | null
  degree_type: '本科' | '硕士' | '博士'
  created_at: string
}

/** 竞赛分类 (A/B类) */
export interface CompetitionCategory {
  category_id: number
  category_name: string
  category_level: 'A' | 'B'
  category_type: string | null
  credit_weight: number
  sort_order: number
  description: string | null
  created_at: string
}

/** 竞赛级别 */
export type CompetitionLevel = 'school' | 'provincial' | 'national' | 'international'

/** 竞赛状态 */
export type CompetitionStatus =
  | 'upcoming'
  | 'registration_open'
  | 'in_progress'
  | 'judging'
  | 'completed'
  | 'cancelled'

/** 准入规则 */
export interface EligibilityRules {
  min_grade?: number
  max_grade?: number
  allowed_majors?: string[]
  team_size_min?: number
  team_size_max?: number
}

/** 竞赛主表 (核心实体) */
export interface Competition {
  competition_id: number
  name: string
  short_name: string | null
  category_id: number | null
  level: CompetitionLevel
  parent_competition_id: number | null
  description: string | null
  official_url: string | null
  hosting_college_id: number | null
  organizer_name: string | null
  contact_teacher: string | null
  contact_phone: string | null
  contact_location: string | null
  registration_start: string | null
  registration_end: string | null
  event_start_date: string | null
  event_end_date: string | null
  eligibility_rules: EligibilityRules
  prerequisite_skills: string[]
  difficulty_score: number
  avg_prep_weeks: number
  historical_win_rate: number | null
  popularity_score: number
  status: CompetitionStatus
  max_participants: number | null
  current_participants: number
  requires_school_review: boolean
  requires_document_upload: boolean
  cover_image_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

/** 竞赛流程里程碑 */
export interface CompetitionMilestone {
  milestone_id: number
  competition_id: number
  week_offset: number
  title: string
  description: string | null
  required_actions: string[]
  is_mandatory: boolean
  sort_order: number
  created_at: string
}

// ---- 第二层: 用户域 (User) ----

/** 用户主表 */
export interface User {
  user_id: number
  csust_id: string
  real_name: string
  nickname: string | null
  gender: string | null
  avatar_url: string | null
  college_id: number | null
  major_id: number | null
  grade: number | null
  class_name: string | null
  enrollment_year: number | null
  phone: string | null
  email: string | null
  wechat_id: string | null
  integrity_score: number
  total_credits: number
  skill_tags: string[]
  bio: string | null
  is_active: boolean
  last_login_at: string | null
  has_seen_guide: boolean
  guide_seen_at: string | null
  created_at: string
  updated_at: string
}

/** 角色 */
export interface Role {
  role_id: number
  role_name: 'super_admin' | 'college_admin' | 'competition_admin' | 'student'
  description: string | null
  permissions: string[]
  created_at: string
}

/** 用户角色关联 */
export interface UserRole {
  user_role_id: number
  user_id: number
  role_id: number
  scope_type: 'none' | 'college' | 'competition'
  scope_college_id: number | null
  scope_competition_id: number | null
  granted_by: number | null
  granted_at: string
  expires_at: string | null
  is_active: boolean
}

/** 诚信记录 */
export interface IntegrityLog {
  log_id: number
  user_id: number
  competition_id: number | null
  action_type: 'no_show' | 'late_withdraw' | 'cheating' | 'violation'
  score_delta: number
  reason: string | null
  created_at: string
}

// ---- 第三层: 报名与团队域 (Registration & Team) ----

/** 团队状态 */
export type TeamStatus =
  | 'forming'
  | 'complete'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'disbanded'

/** 团队角色需求 */
export interface RoleRequirement {
  role: string
  filled: boolean
}

/** 团队 */
export interface Team {
  team_id: number
  competition_id: number
  team_name: string | null
  captain_id: number | null
  status: TeamStatus
  max_members: number
  role_requirements: RoleRequirement[]
  team_tags: string[]
  is_cross_college: boolean
  match_score: number
  formed_at: string | null
  submitted_at: string | null
  created_at: string
  updated_at: string
}

/** 团队成员 */
export interface TeamMember {
  member_id: number
  team_id: number
  user_id: number
  role_in_team: string
  joined_at: string
}

/** 报名类型 */
export type RegistrationType = 'individual' | 'team'

/** 报名状态 (状态机) */
export type RegistrationStatus =
  | 'draft'
  | 'applied'
  | 'school_review'
  | 'school_passed'
  | 'school_rejected'
  | 'provincial_applied'
  | 'provincial_review'
  | 'provincial_passed'
  | 'provincial_rejected'
  | 'national_applied'
  | 'national_review'
  | 'national_passed'
  | 'national_rejected'

/** 审核结果 */
export type ReviewResult = 'pending' | 'passed' | 'rejected'

/** 报名记录 */
export interface Registration {
  registration_id: number
  competition_id: number
  user_id: number
  team_id: number | null
  registration_type: RegistrationType
  status: RegistrationStatus
  school_review_result: ReviewResult | null
  school_review_comment: string | null
  school_reviewed_by: number | null
  school_reviewed_at: string | null
  provincial_review_result: ReviewResult | null
  provincial_review_comment: string | null
  provincial_reviewed_by: number | null
  provincial_reviewed_at: string | null
  national_review_result: ReviewResult | null
  national_review_comment: string | null
  national_reviewed_by: number | null
  national_reviewed_at: string | null
  award_level: string | null
  award_certificate_url: string | null
  credit_earned: number
  documents_json: DocumentAttachment[]
  applied_at: string | null
  created_at: string
  updated_at: string
}

/** 文档附件 */
export interface DocumentAttachment {
  name: string
  url: string
  type: string
}

/** 组队推荐匹配 */
export interface TeamMatchSuggestion {
  suggestion_id: number
  team_id: number
  recommended_user_id: number
  match_reason: string | null
  match_score: number | null
  required_role: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  responded_at: string | null
}

/** 团队模板 */
export interface TeamTemplate {
  template_id: number
  competition_id: number
  template_name: string | null
  description: string | null
  roles_config: TeamRoleConfig[]
  total_members: number
  created_at: string
}

/** 团队角色配置 */
export interface TeamRoleConfig {
  role: string
  count: number
  major_preference: string[]
}

// ---- 第四层: 评审与证书域 (Judging & Certification) ----

/** 评审会话 */
export interface JudgingSession {
  session_id: number
  competition_id: number
  level: CompetitionLevel
  judge_user_id: number | null
  registration_id: number | null
  team_id: number | null
  score_innovation: number | null
  score_technique: number | null
  score_presentation: number | null
  score_total: number | null
  comment: string | null
  judged_at: string
}

/** 电子证书 */
export interface Certificate {
  certificate_id: number
  registration_id: number
  user_id: number
  competition_id: number
  award_level: string
  certificate_no: string | null
  issue_date: string | null
  pdf_url: string | null
  qr_code_url: string | null
  created_at: string
}

// ---- 第五层: 文档与知识库域 (Documents & Knowledge) ----

/** 竞赛文档 */
export interface CompetitionDocument {
  document_id: number
  competition_id: number
  registration_id: number | null
  uploader_id: number | null
  file_name: string
  file_type: string | null
  file_url: string
  file_size_bytes: number | null
  mime_type: string | null
  version: number
  is_current: boolean
  status: 'active' | 'archived' | 'rejected'
  reviewed_by: number | null
  reviewed_at: string | null
  review_comment: string | null
  created_at: string
}

/** 知识库文档来源类型 */
export type KnowledgeSourceType = 'policy' | 'notice' | 'faq' | 'guide' | 'case_study'

/** 知识库文档 */
export interface KnowledgeDocument {
  doc_id: number
  title: string
  source_type: KnowledgeSourceType | null
  source_url: string | null
  source_ref: string | null
  content_text: string | null
  content_html: string | null
  embedding_id: string | null
  is_expired: boolean
  expires_at: string | null
  replaced_by_doc_id: number | null
  tags: string[]
  view_count: number
  created_at: string
  updated_at: string
}

// ---- 第六层: AI 问答与社区域 (AI Chat & Community) ----

/** AI 对话 */
export interface AiConversation {
  conversation_id: number
  user_id: number
  title: string | null
  competition_context: number | null
  created_at: string
  updated_at: string
}

/** AI 消息角色 */
export type AiMessageRole = 'user' | 'assistant' | 'system'

/** AI 消息溯源引用 */
export interface AiSourceRef {
  text: string
  doc_id: number
  url: string | null
}

/** AI 消息 */
export interface AiMessage {
  message_id: number
  conversation_id: number
  role: AiMessageRole
  content: string
  source_doc_ids: number[]
  source_refs: AiSourceRef[]
  model_name: string | null
  token_count: number | null
  latency_ms: number | null
  is_deep_thinking: boolean
  created_at: string
}

/** 社区帖子类型 */
export type PostType = 'question' | 'experience' | 'resource' | 'team_recruit' | 'celebration'

/** 社区帖子 */
export interface CommunityPost {
  post_id: number
  author_id: number
  competition_id: number | null
  title: string
  content: string
  post_type: PostType
  tags: string[]
  is_pinned: boolean
  is_resolved: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
}

/** 社区评论 */
export interface CommunityComment {
  comment_id: number
  post_id: number
  author_id: number
  parent_comment_id: number | null
  content: string
  reward_points: number
  is_accepted_answer: boolean
  created_at: string
}

/** 积分记录 */
export interface PointRecord {
  point_id: number
  user_id: number
  points_change: number
  reason: string
  related_entity: string | null
  related_id: number | null
  balance_after: number
  created_at: string
}

// ---- 第七层: 通知与消息域 (Notifications) ----

/** 通知类型 */
export type NotificationType =
  | 'milestone'
  | 'review_result'
  | 'team_invite'
  | 'community_reply'
  | 'system'
  | 'policy_update'

/** 通知渠道 */
export type NotificationChannel = 'in_app' | 'email' | 'wechat' | 'sms'

/** 通知 */
export interface Notification {
  notification_id: number
  user_id: number
  title: string
  content: string
  notification_type: NotificationType
  related_entity: string | null
  related_id: number | null
  action_url: string | null
  channel: NotificationChannel
  is_read: boolean
  read_at: string | null
  sent_at: string
  created_at: string
}

// ---- 第八层: 审计日志域 (Audit) ----

/** 审计日志 */
export interface AuditLog {
  log_id: number
  actor_id: number | null
  actor_role: string | null
  action: string
  entity_type: string
  entity_id: number | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// ---- 第九层: 统计报表域 (Analytics) ----

/** 学院竞赛统计 */
export interface CollegeCompetitionStat {
  college_id: number
  college_name: string
  competition_id: number
  competition_name: string
  participant_count: number
  winner_count: number
  avg_score: number | null
}

/** 全校竞赛看板统计 */
export interface GlobalCompetitionDashboard {
  category_id: number
  category_name: string
  category_level: string
  level: CompetitionLevel
  total_registrations: number
  unique_participants: number
  total_awards: number
  participating_colleges: number
  total_credits_issued: number
}

/** 管理员全局看板 */
export interface AdminGlobalDashboard {
  college_name: string
  total_students: number
  total_registrations: number
  total_awards: number
  total_credits: number
  win_rate_percent: number | null
}

// ---- 视图类型 ----

/** 用户竞赛档案 */
export interface UserCompetitionProfile {
  user_id: number
  csust_id: string
  real_name: string
  college_name: string | null
  major_name: string | null
  grade: number | null
  integrity_score: number
  total_credits: number
  skill_tags: string[]
  total_registrations: number
  total_awards: number
  team_competition_ids: number[]
}

/** 当前可报名竞赛 */
export interface OpenRegistration extends Competition {
  category_level: string
  category_name: string
}

// ---- 通用类型 ----

/** 统一 API 响应泛型 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
