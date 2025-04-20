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
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" viewBox="0 0 200 148.813">
            <path className="fill-emerald-600" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
          </svg>
          <h1 className="text-3xl font-bold">Timer</h1>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          トップに戻る
        </Link>
      </div>
      <div className="flex-grow flex flex-col">
        <TimerComponent onTimeUpdate={setCurrentTime} onReset={handleResetTimer} className="mb-4" />

        {selectedRecipe ? (
          <div className="flex-grow overflow-auto bg-white rounded-lg shadow-md p-4">
            <div className="space-y-4">
              {steps.map((step, index) => {
                const { progressWidth } = getStepBackgroundColor(step, index, currentTime)

                return (
                  <div
                    key={index}
                    className="relative flex items-center space-x-3 bg-gray-50 p-2 rounded-lg overflow-hidden"
                  >
                    {/* プログレスバー */}
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-200 opacity-50 transition-all duration-300"
                      style={{ width: progressWidth }}
                    />
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-mono text-sm font-bold relative z-10">
                      {index + 1}
                    </div>
                    <div className="flex-grow relative z-10">
                      <p className="text-gray-900 text-sm font-medium">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {selectedRecipe && selectedRecipe.metadata && (
              <div className="mt-4 flex space-x-4 text-sm border-t pt-4">
                <div className="flex-1 flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">前半</div>
                  <div className="text-gray-900 font-semibold">{selectedRecipe.metadata.firstPour?.name || '未設定'}</div>
                </div>
                <div className="flex-1 flex items-center space-x-3 bg-gray-100 p-2 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">後半</div>
                  <div className="text-gray-900 font-semibold">{selectedRecipe.metadata.secondPour?.name || '未設定'}</div>
                </div>
              </div>
            )}
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
