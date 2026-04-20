import { useEffect } from 'react'
import { Trophy, Award, BookOpen, Sparkles } from 'lucide-react'
import { useGuideStore } from '../../stores/guideStore'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

function GuideModal() {
  const { showGuide, checkAndShowGuide, dismissGuide } = useGuideStore()

  useEffect(() => {
    checkAndShowGuide()
  }, [checkAndShowGuide])

  return (
    <Modal open={showGuide} onClose={dismissGuide} title={undefined}>
      <div className="text-center">
        {/* 顶部图标 */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>

        <h2 className="mb-2 text-xl font-bold text-gray-900">
          欢迎来到竞赛助手
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          了解 A/B 类竞赛，开启你的竞赛之旅
        </p>

        {/* A类竞赛 */}
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-left">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">A类竞赛</span>
            <Badge variant="info">国家级</Badge>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            教育部认可的国家级学科竞赛，如数学建模、ACM程序设计、互联网+等。获奖可获创新学分
            <strong className="text-blue-600">2-4分</strong>。
          </p>
        </div>

        {/* B类竞赛 */}
        <div className="mb-6 rounded-lg border border-purple-100 bg-purple-50/50 p-4 text-left">
          <div className="mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-gray-900">B类竞赛</span>
            <Badge variant="purple">省级/行业级</Badge>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            省级或行业级竞赛，如蓝桥杯、中国高校计算机大赛等。获奖可获创新学分
            <strong className="text-purple-600">1-2分</strong>。
          </p>
        </div>

        {/* 底部提示 */}
        <div className="mb-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>更多竞赛信息请查看「竞赛大全」页面</span>
        </div>

        <Button onClick={dismissGuide} className="w-full">
          我已了解
        </Button>
      </div>
    </Modal>
  )
}

export default GuideModal
