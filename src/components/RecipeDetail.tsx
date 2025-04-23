'use client'

import { Recipe } from '@/types/recipe'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import WaterAmountSelector from '@/components/WaterAmountSelector'
import { SIMPLE_DRIP_STEPS, OSMOTIC_FLOW_STEPS, calculateRecipeAmounts, generateTetsu46Steps } from '@/utils/recipeCalculator'

interface Props {
  recipe: Recipe
}

export default function RecipeDetail({ recipe }: Props) {
  console.log('🔍 RecipeDetail Component Rendered', { recipe })
  const { selectedRecipe, setSelectedRecipe } = useRecipe()
  const router = useRouter()
  const [waterAmount, setWaterAmount] = useState(300)

  // カスタムレシピの場合は必ずprops.recipeを使う（selectedRecipeはTetsu46や他ページの影響を受けるため）
  const recipeToShow = recipe.isCustom ? recipe : (selectedRecipe || recipe)
  
  // デバッグ用：recipeToShowの内容をコンソールに出力
  console.log('🔍 Debug - recipeToShow:', {
    id: recipeToShow.id,
    name: recipeToShow.name,
    steps: recipeToShow.steps?.length,
    selectedRecipe: selectedRecipe ? selectedRecipe.id : 'null',
    propsRecipe: recipe.id
  })

  // レシピが存在しない場合のエラーハンドリング
  if (!recipeToShow) {
    return <div>レシピが見つかりませんでした</div>
  }

  // ステップは必ずprops.recipe（localStorageから取得したもの）をそのまま使う
  const getCumulativeWaterAmount = (steps: Recipe['steps'], upToIndex: number): number => {
    return steps
      .slice(0, upToIndex + 1)
      .reduce((acc, curr) => acc + (curr.waterAmount || (curr.pourPercentage !== undefined ? Math.round(waterAmount * (curr.pourPercentage / 100)) : 0)), 0)
  }

  // レシピ情報はprops.recipeをそのまま使う。水量・注湯量の表示のみwaterAmountを反映
  const stepsToShow = recipeToShow.steps || [];

  // デバッグ用：currentRecipeの内容をコンソールに出力
  console.log('Debug - currentRecipe:', JSON.stringify(recipeToShow, null, 2))

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-950">
      <Link href="/recipes" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block text-base font-medium">
        ← Back to recipes
      </Link>

      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{recipe.name}</h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <WaterAmountSelector value={waterAmount} onChange={setWaterAmount} />
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">レシピ詳細</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">{recipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">抽出方法</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.method}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">比率</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.ratio}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">挽き目</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.grindSize}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">コーヒー豆</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.coffeeAmount ? `${recipe.coffeeAmount}g` : '-'}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">お湯</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.waterAmount ? `${recipe.waterAmount}g` : '-'}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">抽出完了時間</div>
              <div className="text-gray-600 dark:text-gray-400">{recipe.totalTime ? `${Math.floor(recipe.totalTime)}分${Math.round((recipe.totalTime % 1) * 60)}秒` : '-'}</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">抽出ステップ</h2>
           {stepsToShow.length > 0 ? (
            <div className="space-y-3">
              {stepsToShow.map((step, index) => {
                let pourAmount = step.waterAmount;
                if (pourAmount === undefined && step.pourPercentage !== undefined) {
                  pourAmount = Math.round(waterAmount * (step.pourPercentage / 100));
                }
                const cumulative = getCumulativeWaterAmount(stepsToShow, index);
                return (
                  <div key={index} className="flex gap-3 items-start text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{step.description}</p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-x-3">
                        {step.duration !== undefined && (
                          <span>{step.duration}秒</span>
                        )}
                        {pourAmount !== undefined && (
                          <span>注湯量: {pourAmount}g</span>
                        )}
                        <span>累計湯量: {cumulative}g</span>
                        {step.amount !== undefined && (
                          <span>{step.amount}g豆</span>
                        )}
                        {step.pourPercentage !== undefined && (
                          <span>注湯割合: {step.pourPercentage}%</span>
                        )}
                        {step.shouldSpin !== undefined && step.shouldSpin && (
                          <span className="inline-block px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded">スピンあり</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* ドリッパーを外すステップ */}
              <div className="flex gap-3 items-start text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {stepsToShow.length + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                    ドリッパーを外す（{recipe.drainageSettings?.shouldDrainCompletely ? '落としきる' : '落としきらない'}）
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-500">ステップが登録されていません。</div>
          )}
        </div>
      </div>
    </main>
  )
}
