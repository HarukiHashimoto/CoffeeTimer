'use client'

import { useState, useEffect } from 'react'
import { Pour, firstPours, secondPours, calculatePours } from '@/data/tetsu46Config'
import { Recipe, Step, Pour as RecipePour } from '@/types/recipe'
import { generateTetsu46Steps } from '@/utils/recipeCalculator'
import { useRecipe } from '@/contexts/RecipeContext'
import { useRouter } from 'next/navigation'

// 秒数を00:00形式にフォーマット
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function Tetsu46Customizer() {
  const router = useRouter()
  const { setSelectedRecipe, setTetsu46Params } = useRecipe()
  const [totalWater, setTotalWater] = useState(300)
  const [selectedFirstPour, setSelectedFirstPour] = useState<Pour>(firstPours[0])
  const [selectedSecondPour, setSelectedSecondPour] = useState<Pour>(secondPours[0])
  const recommendedCoffee = Math.round(totalWater / 15) // 1:15の抽出比率
  const [steps, setSteps] = useState<Step[]>([])
  const [firstPourSteps, setFirstPourSteps] = useState<{ amount: number, time: number, cumulativeTime: number }[]>([])
  const [secondPourSteps, setSecondPourSteps] = useState<{ amount: number, time: number, cumulativeTime: number }[]>([])

  useEffect(() => {
    // calculatePoursを使用してステップを動的に生成
    const { firstSteps, secondSteps } = calculatePours(totalWater, selectedFirstPour, selectedSecondPour)

    setFirstPourSteps(firstSteps)
    setSecondPourSteps(secondSteps)

    // 注ぎ時間と量を反映したステップを生成
    const dynamicSteps: Step[] = [
      ...firstSteps.map((step, index) => ({
        description: `${index + 1}回目: ${step.amount}g注ぐ`,
        duration: step.time,
        waterAmount: step.amount
      })),
      ...secondSteps.map((step, index) => ({
        description: `${firstSteps.length + index + 1}回目: ${step.amount}g注ぐ`,
        duration: step.time,
        waterAmount: step.amount
      })),
      { description: '3:30 ドリッパーを外す' }
    ]

    setSteps(dynamicSteps)

    const customRecipe: Recipe = {
      id: 'tetsu-4-6',
      name: `4:6メソッド（${selectedFirstPour.name} × ${selectedSecondPour.name}）`,
      method: 'ハリオV60',
      description: `前半は「${selectedFirstPour.name}（${selectedFirstPour.description}）」、後半は「${selectedSecondPour.name}（${selectedSecondPour.description}）」の組み合わせです。
\n推奨抽出量：\nコーヒー豆 ${recommendedCoffee}g\nお湯 ${totalWater}g
\n抽出完了時間: 03:30`,
      ratio: `1:${(totalWater / recommendedCoffee).toFixed(1)}`,
      grindSize: '中粗挽き',
      totalTime: 3.5,
      steps: steps,
      image: '/recipes/v60.jpg'
    }
    setSelectedRecipe(customRecipe)
    setSteps(steps)
  }, [totalWater, selectedFirstPour, selectedSecondPour, setSelectedRecipe, recommendedCoffee])

  const handleUseRecipe = () => {
    // calculatePoursを使用してステップを動的に生成
    const { firstSteps, secondSteps } = calculatePours(totalWater, selectedFirstPour, selectedSecondPour)

    // 注ぎ時間と量を反映したステップを生成
    const dynamicSteps: Step[] = [
      ...firstSteps.map((step, index) => ({
        description: `${formatTime(step.cumulativeTime)} ${step.amount}g注ぐ`,
        duration: step.time,
        waterAmount: step.amount
      })),
      ...secondSteps.map((step, index) => ({
        description: `${formatTime(firstSteps[firstSteps.length - 1].cumulativeTime + step.cumulativeTime)} ${step.amount}g注ぐ`,
        duration: step.time,
        waterAmount: step.amount
      })),
      { description: '3:30 ドリッパーを外す' }
    ]

    const customRecipeId = `custom-tetsu-4-6-${Date.now()}`
    const customRecipe: Recipe = {
      id: customRecipeId,
      name: `4:6メソッド（${selectedFirstPour.name} × ${selectedSecondPour.name}）`,
      method: 'ハリオ V60',
      description: `前半は「${selectedFirstPour.name}（${selectedFirstPour.description}）」、後半は「${selectedSecondPour.name}（${selectedSecondPour.description}）」の組み合わせです。
推全抽出量：
コーヒー豆 ${recommendedCoffee}g
お湯 ${totalWater}g
抽出完了時間: 03:30`,
      ratio: `1:${(totalWater / recommendedCoffee).toFixed(1)}`,
      grindSize: '中粗挽き',
      totalTime: 3.5,
      steps: dynamicSteps,
      image: '/recipes/tetsu46.jpg',
      metadata: {
        firstPour: selectedFirstPour,
        secondPour: selectedSecondPour
      }
    }
    setSelectedRecipe(customRecipe)
    setTetsu46Params({
      totalWater,
      firstPour: selectedFirstPour,
      secondPour: selectedSecondPour
    })
    // タイマーページに遷移
    router.push('/timer')
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-gray-900">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Water (g)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={totalWater}
              onChange={(e) => setTotalWater(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              suppressHydrationWarning
            />
            <span className="text-sm font-medium text-gray-700">{totalWater}g</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
            First Pour Style (40%)
          </label>
          <select
            value={selectedFirstPour.name}
            onChange={(e) => {
              const pour = firstPours.find((p) => p.name === e.target.value)
              if (pour) setSelectedFirstPour(pour)
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {firstPours.map((pour) => (
              <option key={pour.name} value={pour.name}>
                {pour.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">{selectedFirstPour.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Second Pour Style (60%)
          </label>
          <select
            value={selectedSecondPour.name}
            onChange={(e) => {
              const pour = secondPours.find((p) => p.name === e.target.value)
              if (pour) setSelectedSecondPour(pour)
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {secondPours.map((pour) => (
              <option key={pour.name} value={pour.name}>
                {pour.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">{selectedSecondPour.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-4 py-2 text-white bg-amber-500 rounded hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            onClick={() => setSelectedFirstPour(firstPours[0])}
          >
            Reset First Pour
          </button>
          <button
            className="px-4 py-2 text-white bg-amber-500 rounded hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            onClick={() => setSelectedSecondPour(secondPours[0])}
          >
            Reset Second Pour
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-emerald-800 border-b-2 border-emerald-300 pb-2">Current Recipe</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-700 mb-2">抽出比率</h3>
            <p className="text-xl font-mono text-emerald-900">1:{(totalWater / recommendedCoffee).toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-emerald-700 mb-2">推奨抽出量</h3>
            <div className="flex justify-between">
              <span>コーヒー豆:</span>
              <span className="font-mono text-emerald-900">{recommendedCoffee}g</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>お湯:</span>
              <span className="font-mono text-emerald-900">{totalWater}g</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-emerald-700 mb-2">注ぎ方</h3>
            <div className="flex justify-between">
              <span>前半:</span>
              <span className="text-emerald-900">{selectedFirstPour.name}（{selectedFirstPour.description}）</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>後半:</span>
              <span className="text-emerald-900">{selectedSecondPour.name}（{selectedSecondPour.description}）</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4">注ぎステップ</h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-emerald-600 mb-2">前半のステップ</h4>
                {firstPourSteps.map((step, index) => (
                  <div key={index} className="mb-1">
                    <p className="font-mono">
                      <span className="text-emerald-900">{formatTime(step.cumulativeTime)} {step.amount}g注ぐ</span>
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-emerald-600 mb-2">後半のステップ</h4>
                {secondPourSteps.map((step, index) => (
                  <div key={index} className="mb-1">
                    <p className="font-mono">
                      <span className="text-emerald-900">{formatTime(step.cumulativeTime)} {step.amount}g注ぐ</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4">抽出完了</h3>
            <div className="mb-1">
              <p className="font-mono">
                <span className="text-emerald-900">03:30 ドリッパーを外す</span>
              </p>
            </div>
          </div>
        </div>
        <button
          className="w-full mt-6 px-4 py-2 text-white bg-emerald-500 rounded hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          onClick={handleUseRecipe}
        >
          Use This Recipe
        </button>
      </div>
    </div>
  )
}
