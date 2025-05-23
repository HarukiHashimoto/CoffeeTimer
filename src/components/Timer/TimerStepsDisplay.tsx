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
        let effectiveDuration = stepDuration;
        let effectiveEndTime = stepEndTime;

        // --- カスタムレシピの「最後の通常ステップ→ドリッパー外し」特別処理 ---
        const isLastNormalStep =
          steps[index + 1]?.isEjectDripper && !step.isEjectDripper &&
          steps.filter(s => !s.isEjectDripper).length > 0 &&
          index === steps.filter(s => !s.isEjectDripper).length - 1;
        const dripperEjectStep = steps.find(s => s.isEjectDripper);
        if (isLastNormalStep && dripperEjectStep && typeof step.startTime === 'number' && typeof dripperEjectStep.startTime === 'number') {
          const start = step.startTime;
          const end = dripperEjectStep.startTime;
          if (currentTime > start && currentTime < end) {
            progressWidth = `${Math.min(100, ((currentTime - start) / (end - start)) * 100)}%`;
          } else if (currentTime >= end) {
            progressWidth = '100%';
          }
        } else if (step.isEjectDripper && typeof step.startTime === 'number') {
          // ドリッパー外しステップはstartTimeになった瞬間に100%
          if (currentTime >= step.startTime) {
            progressWidth = '100%';
          }
        } else if (effectiveDuration > 0) {
          if (currentTime > cumulativeDuration && currentTime < effectiveEndTime) {
            progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (effectiveEndTime - cumulativeDuration)) * 100)}%`;
          } else if (currentTime >= effectiveEndTime) {
            progressWidth = '100%';
          }
          // currentTime === cumulativeDuration のときは0%
        } else if (index === steps.length - 1) {
          // 最終ステップがduration 0（例: ドリッパーを外す等）の場合、currentTimeがcumulativeDuration以降で100%
          if (currentTime >= cumulativeDuration) {
            progressWidth = '100%';
          }
        }

        // デバッグログは本番では削除または条件付きにすることを推奨
        // console.log('[TimerStepsDisplay] step', {
        //   index,
        //   description: step.description,
        //   isEjectDripper: step.isEjectDripper,
        //   currentTime,
        //   startTime: step.startTime,
        //   progressWidth,
        //   isLastNormalStep,
        //   dripperEjectStepStart: dripperEjectStep?.startTime,
        // });

        return (
          <div key={index} className="relative flex items-center space-x-3 bg-light-bg dark:bg-dark-surface-secondary p-3 rounded-lg overflow-hidden">
            {/* プログレスバー */}
            <div
              className="absolute left-0 top-0 h-full bg-light-primary/30 dark:bg-dark-primary/30 transition-all duration-300"
              style={{ width: progressWidth }}
            />
            <div className="w-8 h-8 rounded-full bg-light-primary dark:bg-dark-primary text-white flex items-center justify-center flex-shrink-0 font-mono text-sm font-bold relative z-10">
              {index + 1}
            </div>
            <div className="flex-grow relative z-10">
              <div>
                <p className="text-light-text dark:text-dark-text text-sm font-medium">{step.description || '（内容未設定）'}</p>
                {step.waterAmount ? (
                  <p className="text-light-text/75 dark:text-dark-text/75 text-xs mt-1">
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
