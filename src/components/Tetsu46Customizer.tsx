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
    router.push('/CoffeeTimer/timer')
  }, [totalWater, selectedFirstPour, selectedSecondPour, setSelectedRecipe, router])

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-md p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Water Amount (g)
        </label>
        <input
          type="number"
          value={totalWater}
          onChange={(e) => setTotalWater(Number(e.target.value))}
          min="200"
          max="1000"
          step="10"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Pour Style (40%)
        </label>
        <select
          value={firstPours.indexOf(selectedFirstPour)}
          onChange={(e) => setSelectedFirstPour(firstPours[Number(e.target.value)])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {firstPours.map((pour, index) => (
            <option key={pour.name} value={index}>
              {pour.name} - {pour.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Second Pour Style (60%)
        </label>
        <select
          value={secondPours.indexOf(selectedSecondPour)}
          onChange={(e) => setSelectedSecondPour(secondPours[Number(e.target.value)])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {secondPours.map((pour, index) => (
            <option key={pour.name} value={index}>
              {pour.name} - {pour.description}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
