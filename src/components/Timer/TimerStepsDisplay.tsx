import { Step } from '@/types/recipe'

interface Props {
  steps: Step[]
  currentTime: number
}

export default function TimerStepsDisplay({ steps, currentTime }: Props) {
  // ステップの見せ方はここで統一
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        // プログレスバー進捗計算（TimerPageと同じロジック）
        const cumulativeDuration = steps.slice(0, index).reduce((acc, curr) => acc + (typeof curr.duration === 'number' ? curr.duration : 0), 0);
        const stepDuration = typeof step.duration === 'number' ? step.duration : 0;
        const stepEndTime = cumulativeDuration + stepDuration;

        let progressWidth = '0%';
        if (stepDuration > 0) {
          if (currentTime >= cumulativeDuration && currentTime < stepEndTime) {
            progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (stepEndTime - cumulativeDuration)) * 100)}%`;
          } else if (currentTime >= stepEndTime) {
            progressWidth = '100%';
          }
        } else if (stepDuration === 0 && currentTime >= cumulativeDuration) {
          progressWidth = '100%';
        }

        return (
          <div key={index} className="relative flex items-center space-x-3 bg-gray-50 p-2 rounded-lg overflow-hidden">
            {/* プログレスバー */}
            <div
              className="absolute left-0 top-0 h-full bg-emerald-200 opacity-50 transition-all duration-300"
              style={{ width: progressWidth }}
            />
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-sm font-bold relative z-10">
              {index + 1}
            </div>
            <div className="flex-grow relative z-10">
              <div>
                <p className="text-gray-900 text-sm font-medium">{step.description}</p>
                {step.waterAmount ? (
                  <p className="text-gray-600 text-xs mt-1">
                    合計: {steps.slice(0, index + 1).reduce((sum, s) => sum + (typeof s.waterAmount === 'number' ? s.waterAmount : 0), 0)}g
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}
