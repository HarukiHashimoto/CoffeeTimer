'use client'

import TimerComponent from '@/components/TimerComponent'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'

import { generateTetsu46Steps } from '@/utils/recipeCalculator'

export default function TimerPage() {
  const { selectedRecipe, tetsu46Params } = useRecipe()

  let steps = selectedRecipe?.steps || []
  if (selectedRecipe?.id === 'tetsu-4-6') {
    const totalWater = tetsu46Params?.totalWater || 300
    steps = generateTetsu46Steps(totalWater)
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Timer</h1>
      <TimerComponent />

      {selectedRecipe ? (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold">{selectedRecipe.name}</h2>
            <Link href={`/recipes/${selectedRecipe.id}`} className="text-blue-600 hover:underline text-sm">
              View Recipe Details
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div>
              <div className="font-medium text-gray-900">Method</div>
              <div className="text-gray-600">{selectedRecipe.method}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Ratio</div>
              <div className="text-gray-600">{selectedRecipe.ratio}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Grind Size</div>
              <div className="text-gray-600">{selectedRecipe.grindSize}</div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-center font-bold mr-2">
                      {index + 1}
                    </span>
                    <span>
                      {`${index + 1}回目:`}
                      {step.duration ? ` ${step.duration}秒で` : ''}
                      {step.waterAmount ? `${step.waterAmount}g` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
