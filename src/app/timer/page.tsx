'use client'

import { useState } from 'react'
import Tetsu46Timer from '@/components/Timer/Tetsu46Timer'
import GenericRecipeTimer from '@/components/Timer/GenericRecipeTimer'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'

import { Step } from '@/types/recipe'

export default function TimerPage() {
  const { selectedRecipe } = useRecipe();
  const [currentTime, setCurrentTime] = useState(0);
  const steps: Step[] = Array.isArray(selectedRecipe?.steps) ? selectedRecipe.steps : [];

  const firstPourName = selectedRecipe?.metadata?.firstPour?.name || '';
  const secondPourName = selectedRecipe?.metadata?.secondPour?.name || '';

  const getCumulativeWaterAmount = (steps: Step[], upToIndex: number): number => {
    return steps
      .slice(0, upToIndex + 1)
      .reduce((acc, curr) => acc + (typeof curr.waterAmount === 'number' ? curr.waterAmount : 0), 0)
  }

  const getStepBackgroundColor = (step: Step, index: number, currentTime: number) => {
    const cumulativeDuration = steps.slice(0, index).reduce((acc, curr) => acc + (typeof curr.duration === 'number' ? curr.duration : 0), 0)
    const stepDuration = typeof step.duration === 'number' ? step.duration : 0
    const stepEndTime = cumulativeDuration + stepDuration

    let progressWidth = '0%'

    if (stepDuration > 0) {
      if (currentTime >= cumulativeDuration && currentTime < stepEndTime) {
        progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (stepEndTime - cumulativeDuration)) * 100)}%`
      } else if (currentTime >= stepEndTime) {
        progressWidth = '100%'
      }
    } else if (stepDuration === 0 && currentTime >= cumulativeDuration) {
      // ドリッパーを外すstepなどduration=0のものにも色を付ける
      progressWidth = '100%'
    }

    return { progressWidth }
  }
  return (
    <div className="container mx-auto px-4 py-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" viewBox="0 0 200 148.813">
            <path className="fill-emerald-600" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
          </svg>
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-600">Timer</h1>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          トップに戻る
        </Link>
      </div>
      {/* タイマー本体を上部に配置 */}
      <div className="mt-6">
        {selectedRecipe?.id === 'tetsu-4-6' ? (
          <Tetsu46Timer />
        ) : (
          <GenericRecipeTimer />
        )}
      </div>
      {/* レシピ未選択時のみ案内を表示 */}
      {!selectedRecipe && (
        <div className="p-8 text-center text-gray-500">
          レシピが選択されていません。
          <div className="mt-4">
            <Link href="/recipes" className="text-blue-600 hover:underline">レシピ一覧へ</Link>
          </div>
        </div>
      )}
    </div>
  );
}
