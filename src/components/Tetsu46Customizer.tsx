'use client'

import { useState, useEffect } from 'react'
import { Pour, firstPours, secondPours, calculatePours } from '@/data/tetsu46Config'
import { Recipe, Step, Pour as RecipePour } from '@/types/recipe'
import { generateTetsu46Steps } from '@/utils/recipeCalculator'
import { useRecipe } from '@/contexts/RecipeContext'
import { useRouter } from 'next/navigation'
import WaterAmountSelector from '@/components/WaterAmountSelector'

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
  const [selectedSecondPour, setSelectedSecondPour] = useState<Pour>(secondPours[2])
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
推奨抽出量：
コーヒー豆 ${recommendedCoffee}g
お湯 ${totalWater}g
抽出完了時間: 03:30`,
      ratio: `1:${(totalWater / recommendedCoffee).toFixed(1)}`,
      coffeeAmount: recommendedCoffee,
      waterAmount: totalWater,
      grindSize: '中粗挽き',
      totalTime: 3.5,
      steps: steps,
      image: '/recipes/v60.jpg',
      drainageSettings: {
        shouldDrainCompletely: true,
        drainageDuration: 30
      }
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
        description: `${formatTime(step.cumulativeTime)} ${step.amount}g注ぐ`,
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
      coffeeAmount: recommendedCoffee,
      waterAmount: totalWater,
      grindSize: '中粗挽き',
      totalTime: 3.5,
      steps: dynamicSteps,
      drainageSettings: {
        shouldDrainCompletely: true,
        drainageDuration: 30
      },
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
      {/* Section for selecting pour styles */}
      <div className="space-y-6 bg-light-bg dark:bg-dark-surface-secondary rounded-lg p-6">
        <div className="mb-4">
          <WaterAmountSelector value={totalWater} onChange={setTotalWater} />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
            First Pour Style (40%)
          </label>
          <select
            value={selectedFirstPour.name}
            onChange={(e) => {
              const pour = firstPours.find((p) => p.name === e.target.value)
              if (pour) setSelectedFirstPour(pour)
            }}
            className="w-full px-3 py-2 rounded-md bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          >
            {firstPours.map((pour) => (
              <option key={pour.name} value={pour.name}>
                {pour.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-light-text/75 dark:text-dark-text/75">{selectedFirstPour.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
            Second Pour Style (60%)
          </label>
          <select
            value={selectedSecondPour.name}
            onChange={(e) => {
              const pour = secondPours.find((p) => p.name === e.target.value)
              if (pour) setSelectedSecondPour(pour)
            }}
            className="w-full px-3 py-2 rounded-md bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          >
            {secondPours.map((pour) => (
              <option key={pour.name} value={pour.name}>
                {pour.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-light-text/75 dark:text-dark-text/75">{selectedSecondPour.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-surface-secondary"
            onClick={() => setSelectedFirstPour(firstPours[0])}
          >
            Reset First Pour
          </button>
          <button
            className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-surface-secondary"
            onClick={() => setSelectedSecondPour(secondPours[0])}
          >
            Reset Second Pour
          </button>
        </div>
      </div>

      {/* Section for displaying the current recipe details */}
      <div className="bg-light-bg dark:bg-dark-surface-secondary rounded-lg p-6">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text border-b-2 border-light-primary/50 dark:border-dark-primary/50 pb-2 mb-4">Current Recipe</h2>
        <div className="space-y-4 text-light-text dark:text-dark-text">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-2">抽出比率</h3>
            <p className="text-xl font-mono">1:{(totalWater / recommendedCoffee).toFixed(1)}</p>
          </div>
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-2">推奨量</h3>
            <div className="flex justify-between">
              <span>コーヒー豆:</span>
              <span className="font-mono">{recommendedCoffee}g</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>お湯:</span>
              <span className="font-mono">{totalWater}g</span>
            </div>
          </div>
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-2">抽出スタイル</h3>
            <div className="flex justify-between">
              <span>前半:</span>
              <span className="text-right">{selectedFirstPour.name}（{selectedFirstPour.description}）</span>
            </div>
            <div className="flex justify-between">
              <span>後半:</span>
              <span className="text-right">{selectedSecondPour.name}（{selectedSecondPour.description}）</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-4">抽出ステップ</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-light-primary/80 dark:text-dark-primary/80 mb-2">前半</h4>
                  {firstPourSteps.map((step, index) => {
                    const cumulativeAmount = firstPourSteps
                      .slice(0, index + 1)
                      .reduce((acc, curr) => acc + curr.amount, 0)
                    return (
                      <div key={index} className="mb-2">
                        <p className="font-mono">
                          <span>{formatTime(step.cumulativeTime)} - {step.amount}g注ぐ</span>
                        </p>
                        <p className="text-sm text-light-text/75 dark:text-dark-text/75 mt-0.5">
                          合計: {cumulativeAmount}g
                        </p>
                      </div>
                    )
                  })}
                </div>
                <div>
                  <h4 className="font-medium text-light-primary/80 dark:text-dark-primary/80 mb-2">後半</h4>
                  {secondPourSteps.map((step, index) => {
                    const firstPourTotal = firstPourSteps.reduce((acc, curr) => acc + curr.amount, 0)
                    const secondPourCumulative = secondPourSteps
                      .slice(0, index + 1)
                      .reduce((acc, curr) => acc + curr.amount, 0)
                    const totalAmount = firstPourTotal + secondPourCumulative
                    return (
                      <div key={index} className="mb-2">
                        <p className="font-mono">
                          <span>{formatTime(step.cumulativeTime)} - {step.amount}g注ぐ</span>
                        </p>
                        <p className="text-sm text-light-text/75 dark:text-dark-text/75 mt-0.5">
                          合計: {totalAmount}g
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-4">抽出完了</h3>
            <div className="mb-1">
              <p className="font-mono">
                <span>03:30 - ドリッパーを外す</span>
              </p>
            </div>
          </div>
        </div>
        <button
          className="w-full mt-6 px-4 py-2 text-white bg-light-primary dark:bg-dark-primary rounded-lg shadow hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:ring-offset-light-surface dark:focus:ring-offset-dark-surface"
          onClick={handleUseRecipe}
        >
          Use This Recipe
        </button>
      </div>
    </div>
  )
}
