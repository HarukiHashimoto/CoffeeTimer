'use client'

import { useState } from 'react'
import { Recipe } from '@/types/recipe'
import { useRecipe } from '@/contexts/RecipeContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Tetsu46Customizer from '@/components/Tetsu46Customizer'

export default function Tetsu46Page() {
  const { setSelectedRecipe } = useRecipe()
  const router = useRouter()
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/recipes" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to recipes
      </Link>

      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">4:6メソッド カスタマイズ</h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">4:6メソッドについて</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            粋谷哲氏が考案した4:6メソッドは、抽出を前半40%と後半60%に分け、
            それぞれの注ぎ方を変えることで味わいをコントロールする手法です。
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            前半の注ぎ方で酸味と甘みのバランスを、後半の注ぎ方でコクの強さを調整できます。
            下のオプションから、お好みの組み合わせを選んでください。
          </p>
        </div>

        <Tetsu46Customizer onRecipeChange={setCurrentRecipe} />

        {currentRecipe && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6">
            <div>
              <button
                onClick={() => {
                  setSelectedRecipe(currentRecipe)
                  router.push('/timer')
                }}
                className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors font-medium mb-6"
              >
                Use This Recipe
              </button>
              <h2 className="text-xl font-semibold mb-4">レシピ詳細</h2>
              <p className="text-gray-600 mb-4">{currentRecipe.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                <div>
                  <div className="font-medium text-gray-900">抽出方法</div>
                  <div className="text-gray-600">{currentRecipe.method}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">比率</div>
                  <div className="text-gray-600">{currentRecipe.ratio}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">挽き目</div>
                  <div className="text-gray-600">{currentRecipe.grindSize}</div>
                </div>
              </div>

              <div className="space-y-3">
                {currentRecipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{step.description}</p>
                      <div className="text-xs text-gray-600 space-x-3">
                        {step.duration && (
                          <span>{step.duration}秒</span>
                        )}
                        {step.waterAmount && (
                          <span>{step.waterAmount}gのお湯</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
