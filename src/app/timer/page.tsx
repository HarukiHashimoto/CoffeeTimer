'use client'

import { useState } from 'react'
import TimerComponent from '@/components/TimerComponent'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'

import { generateTetsu46Steps } from '@/utils/recipeCalculator'
import { Step } from '@/types/recipe'

export default function TimerPage() {
  const { selectedRecipe, tetsu46Params } = useRecipe()
  const [currentTime, setCurrentTime] = useState(0)

  const handleResetTimer = () => {
    setCurrentTime(0)
  }

  let steps: Step[] = []
  if (selectedRecipe) {
    steps = selectedRecipe.steps
  }

  // カスタムレシピの場合、メタデータを表示
  const firstPourName = selectedRecipe?.metadata?.firstPour?.name || 'ベーシック'
  const secondPourName = selectedRecipe?.metadata?.secondPour?.name || 'さらに濃く'

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Timer</h1>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          トップに戻る
        </Link>
      </div>
      <TimerComponent onTimeUpdate={setCurrentTime} onReset={handleResetTimer} />

      {selectedRecipe ? (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold">{selectedRecipe.name}</h2>
            {!selectedRecipe.id.startsWith('custom-') && (
              <Link href={`/recipes/${selectedRecipe.id}`} className="text-blue-600 hover:underline text-sm">
                View Recipe Details
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <div className="font-medium text-gray-900">Ratio</div>
              <div className="text-gray-600">{selectedRecipe.ratio}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Grind Size</div>
              <div className="text-gray-600">{selectedRecipe.grindSize}</div>
            </div>
            {selectedRecipe.metadata && (
              <div>
                <div className="font-medium text-gray-900">前半のスタイル</div>
                <div className="text-gray-600">{firstPourName}</div>
              </div>
            )}
            {selectedRecipe.metadata && (
              <div>
                <div className="font-medium text-gray-900">後半のスタイル</div>
                <div className="text-gray-600">{secondPourName}</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              // 各ステップの開始時間と終了時間を計算
              const cumulativeDuration = steps.slice(0, index).reduce((sum, s) => sum + (s.duration || 0), 0)
              const stepEndTime = cumulativeDuration + (step.duration || 0)

              let bgColor = 'bg-gray-50'
              let textColor = 'text-gray-900'
              let progressWidth = '0%'

              if (currentTime >= cumulativeDuration && currentTime < stepEndTime) {
                // 現在のステップ
                bgColor = 'bg-emerald-100'
                textColor = 'text-emerald-900'
                progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (stepEndTime - cumulativeDuration)) * 100)}%`
              } else if (currentTime >= stepEndTime) {
                // 完了したステップ
                bgColor = 'bg-green-100'
                textColor = 'text-green-900'
                progressWidth = '100%'
              }

              return (
                <div key={index} className={`relative flex items-center space-x-4 ${bgColor} p-3 rounded-lg overflow-hidden`}>
                  {/* プログレスバー */}
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-200 opacity-50 transition-all duration-300"
                    style={{ width: progressWidth }}
                  />
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono font-bold relative z-10">
                    {index + 1}
                  </div>
                  <div className="flex-grow relative z-10">
                    <p className={`${textColor} font-medium`}>{step.description}</p>
                    {step.waterAmount && (
                      <p className="text-sm text-gray-600 mt-1">
                        水量: {step.waterAmount}g
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">No recipe selected</p>
          <Link href="/recipes" className="text-blue-600 hover:underline">
            Browse Recipes
          </Link>
        </div>
      )}
    </main>
  )
}
