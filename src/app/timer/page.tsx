'use client'

import { useState } from 'react'
import TimerComponent from '@/components/TimerComponent'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'

import { Step } from '@/types/recipe'

export default function TimerPage() {
  const { selectedRecipe } = useRecipe()
  const [currentTime, setCurrentTime] = useState(0)

  const handleResetTimer = () => {
    setCurrentTime(0)
  }

  const steps: Step[] = selectedRecipe?.steps || []

  const firstPourName = selectedRecipe?.metadata?.firstPour?.name || ''
  const secondPourName = selectedRecipe?.metadata?.secondPour?.name || ''

  const getStepBackgroundColor = (step: Step, index: number, currentTime: number) => {
    const cumulativeDuration = steps.slice(0, index).reduce((acc, curr) => acc + (curr.duration || 0), 0)
    const stepEndTime = cumulativeDuration + (step.duration || 0)

    let progressWidth = '0%'

    if (currentTime >= cumulativeDuration && currentTime < stepEndTime) {
      progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (stepEndTime - cumulativeDuration)) * 100)}%`
    } else if (currentTime >= stepEndTime) {
      progressWidth = '100%'
    }

    return { progressWidth }
  }

  return (
    <div className="container mx-auto px-4 py-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Timer</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          トップに戻る
        </Link>
      </div>
      <div className="flex-grow flex flex-col">
        <TimerComponent onTimeUpdate={setCurrentTime} onReset={handleResetTimer} className="mb-4" />

        {selectedRecipe ? (
          <div className="flex-grow overflow-auto bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                const { progressWidth } = getStepBackgroundColor(step, index, currentTime)

                return (
                  <div
                    key={index}
                    className="relative flex items-center space-x-4 bg-gray-50 p-3 rounded-lg overflow-hidden"
                  >
                    {/* プログレスバー */}
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-200 opacity-50 transition-all duration-300"
                      style={{ width: progressWidth }}
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono font-bold relative z-10">
                      {index + 1}
                    </div>
                    <div className="flex-grow relative z-10">
                      <p className="text-gray-900 font-medium">{step.description}</p>
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
      </div>
    </div>
  )
}
