'use client'

import { useState, useEffect } from 'react'
import { Pour, firstPours, secondPours, calculatePours } from '@/data/tetsu46Config'
import { Recipe } from '@/types/recipe'
import { useRecipe } from '@/contexts/RecipeContext'
import { useRouter } from 'next/navigation'

export default function Tetsu46Customizer() {
  const router = useRouter()
  const { setSelectedRecipe } = useRecipe()
  const [totalWater, setTotalWater] = useState(300)
  const [selectedFirstPour, setSelectedFirstPour] = useState<Pour>(firstPours[0])
  const [selectedSecondPour, setSelectedSecondPour] = useState<Pour>(secondPours[0])
  const recommendedCoffee = Math.round(totalWater / 15) // 1:15の抽出比率

  useEffect(() => {
    const { firstSteps, secondSteps, recommendedCoffee } = calculatePours(
      totalWater,
      selectedFirstPour,
      selectedSecondPour
    )

    // 各ステップの時間を計算
    let currentTime = 0
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const steps = [
      ...firstSteps.map((step, i) => {
        const stepDescription = `${formatTime(currentTime)} ${i + 1}回目: ${step.amount}gのお湯を注ぐ`
        currentTime += 45 // 45秒間隔
        return {
          description: stepDescription,
          duration: 10,
          waterAmount: step.amount
        }
      }),
      ...secondSteps.map((step, i) => {
        const stepDescription = `${formatTime(currentTime)} ${i + 1}回目: ${step.amount}gのお湯を注ぐ`
        currentTime += 45 // 45秒間隔
        return {
          description: stepDescription,
          duration: 10,
          waterAmount: step.amount
        }
      }),
      {
        description: '03:30 ドリッパーを外す',
        duration: 10
      }
    ]

    const customRecipe: Recipe = {
      id: 'tetsu-4-6',
      name: `4:6メソッド（${selectedFirstPour.name} × ${selectedSecondPour.name}）`,
      method: 'ハリオV60',
      description: `前半は「${selectedFirstPour.name}（${selectedFirstPour.description}）」、後半は「${selectedSecondPour.name}（${selectedSecondPour.description}）」の組み合わせです。

推奨抽出量：
コーヒー豆 ${recommendedCoffee}g
お湯 ${totalWater}g`,
      ratio: `1:${(totalWater / recommendedCoffee).toFixed(1)}`,
      grindSize: '中粗挽き',
      totalTime: 3.5,
      steps: steps,
      image: '/recipes/v60.jpg'
    }

    setSelectedRecipe(customRecipe)
  }, [totalWater, selectedFirstPour, selectedSecondPour, setSelectedRecipe])

  const handleUseRecipe = () => {
    router.push('/timer')
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Water (g)
          </label>
          <input
            type="number"
            value={totalWater}
            onChange={(e) => setTotalWater(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <h2 className="text-xl font-semibold mb-4">Current Recipe</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">抽出比率</h3>
            <p>1:{(totalWater / recommendedCoffee).toFixed(1)}</p>
          </div>
          <div>
            <h3 className="font-medium">推奨抽出量</h3>
            <p>コーヒー豆: {recommendedCoffee}g</p>
            <p>お湯: {totalWater}g</p>
          </div>
          <div>
            <h3 className="font-medium">注ぎ方</h3>
            <p>前半: {selectedFirstPour.name}（{selectedFirstPour.description}）</p>
            <p>後半: {selectedSecondPour.name}（{selectedSecondPour.description}）</p>
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
