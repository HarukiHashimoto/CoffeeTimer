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

    let bgColor = 'bg-gray-100'
    let textColor = 'text-gray-900'
    let progressWidth = '0%'

    if (currentTime >= cumulativeDuration && currentTime < stepEndTime) {
      bgColor = 'bg-emerald-100'
      textColor = 'text-emerald-900'
      progressWidth = `${Math.min(100, ((currentTime - cumulativeDuration) / (stepEndTime - cumulativeDuration)) * 100)}%`
    } else if (currentTime >= stepEndTime) {
      bgColor = 'bg-green-100'
      textColor = 'text-green-900'
      progressWidth = '100%'
    }

    return { bgColor, textColor, progressWidth }
  }

  return (
    <div className="container mx-auto px-4 py-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">タイマー</h1>
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

            <div className="space-y-3">
              {steps.map((step, index) => {
                const { bgColor, textColor, progressWidth } = getStepBackgroundColor(step, index, currentTime)

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-colors duration-300 ${bgColor} ${textColor}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{step.description}</span>
                      <div className="w-1/3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: progressWidth,
                          }}
                        ></div>
                      </div>
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
