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
  const { selectedRecipe, setSelectedRecipe } = useRecipe()
  const router = useRouter()
  const [waterAmount, setWaterAmount] = useState(300)

  // カスタムレシピの場合は必ずprops.recipeを使う（selectedRecipeはTetsu46や他ページの影響を受けるため）
  const recipeToShow = recipe.isCustom ? recipe : (selectedRecipe || recipe)

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
  // ドリッパー外し（isEjectDripper）ステップは詳細ページのリストから除外
  const stepsToShow = (recipeToShow.steps || []).filter(step => !step.isEjectDripper);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto bg-gray-100 dark:bg-gray-950">
      <Link href="/recipes" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block text-base font-medium">
        ← Back to recipes
      </Link>

      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{recipe.name}</h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <button
            className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow font-bold hover:bg-emerald-700 transition-colors text-lg w-full"
            onClick={() => {
              // stepsToShowはisEjectDripper除外済み、dripper-ejectステップは末尾に追加
              let stepsForTimer = stepsToShow;
              const dripperEjectStep = (recipeToShow.steps || []).find(s => s.isEjectDripper);
              if (dripperEjectStep) {
                stepsForTimer = [...stepsToShow, dripperEjectStep];
              }
              setSelectedRecipe({ ...recipeToShow, steps: stepsForTimer })
              router.push('/timer')
            }}
          >
            Use This Recipe
          </button>
          <div className="mb-6">
            <WaterAmountSelector value={waterAmount} onChange={setWaterAmount} />
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">レシピ詳細</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">{recipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
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
              <div className="text-gray-600 dark:text-gray-400">
                {recipe.drainageSettings?.drainageDuration !== undefined
                  ? `${Math.floor(recipe.drainageSettings.drainageDuration / 60)}分${recipe.drainageSettings.drainageDuration % 60}秒`
                  : '-'}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">抽出ステップ</h2>
          {stepsToShow.length > 0 ? (
            <div className="space-y-3">
              {stepsToShow.map((step, index) => {
                const cumulative = getCumulativeWaterAmount(stepsToShow, index);
                return (
                  <div key={index} className="mb-3 flex gap-3 items-start text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {step.description}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        合計: {cumulative}g
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
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {(() => {
                      const duration = recipe.drainageSettings?.drainageDuration ?? 0;
                      const minutes = Math.floor(duration / 60);
                      const seconds = duration % 60;
                      const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                      return `${timeStr} - ドリッパーを外す（${recipe.drainageSettings?.shouldDrainCompletely ? '落としきる' : '落としきらない'}）`;
                    })()}
                  </div>
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
