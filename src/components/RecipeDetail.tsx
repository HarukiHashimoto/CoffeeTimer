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
  // デフォルトはレシピ作成時の湯量
  const recipeToShow = recipe.isCustom ? recipe : (selectedRecipe || recipe)
  const [waterAmount, setWaterAmount] = useState(recipeToShow.waterAmount)

  // レシピが存在しない場合のエラーハンドリング
  if (!recipeToShow) {
    return <div>レシピが見つかりませんでした</div>
  }

  // 指定したwaterAmountで各stepのwaterAmount/descriptionを再生成
  const generateDisplaySteps = (steps: Recipe['steps'], totalWater: number) => {
    return steps.map((step, idx, arr) => {
      // 時刻表示は常に表示（00:00も含む）
      let timeStr = typeof step.startTime === 'number' ? `${String(Math.floor(step.startTime / 60)).padStart(2, '0')}:${String(step.startTime % 60).padStart(2, '0')}` : '';
      let desc = '';
      let waterAmt: number | undefined = undefined;
      timeStr = timeStr === '' ? '00:00' : timeStr;
      if (step.isEjectDripper) {
        // ドリッパー外しはdescriptionの先頭に時刻があれば重複させない
        if (step.description && /^\d{2}:\d{2}\s*-/.test(step.description)) {
          desc = step.description;
        } else {
          desc = `${timeStr} - ${step.description || 'ドリッパーを外す'}`;
        }
      } else if (step.pourPercentage && step.pourPercentage > 0) {
        waterAmt = Math.round(totalWater * (step.pourPercentage / 100));
        // 1step目も必ず時刻を表示
        desc = `${timeStr} - ${waterAmt}g注ぐ`;
        if (step.shouldSpin) {
          desc += '（スピン有）';
        }
      } else if (step.shouldSpin) {
        // 1step目も必ず時刻を表示
        desc = `${timeStr} - 攪拌する（スピン有）`;
      } else {
        // 1step目も必ず時刻を表示
        desc = `${timeStr} - ${step.description || '（内容未設定）'}`;
      }
      return {
        ...step,
        description: desc,
        waterAmount: waterAmt,
      }
    });
  }

  // ドリッパー外し以外
  const stepsToShow = generateDisplaySteps((recipeToShow.steps || []).filter(step => !step.isEjectDripper), waterAmount);
  // ドリッパー外し（あれば）
  const dripperEjectStep = (recipeToShow.steps || []).find(s => s.isEjectDripper);
  const dripperEjectStepDisplay = dripperEjectStep ? generateDisplaySteps([dripperEjectStep], waterAmount)[0] : undefined;

  // 合計湯量計算
  const getCumulativeWaterAmount = (steps: Recipe['steps'], upToIndex: number): number => {
    return steps
      .slice(0, upToIndex + 1)
      .reduce((acc, curr) => acc + (curr.waterAmount || (curr.pourPercentage !== undefined ? Math.round(waterAmount * (curr.pourPercentage / 100)) : 0)), 0)
  }


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
              // 抽出時点のwaterAmountでstep情報を再生成してタイマーに渡す
              const stepsForTimer = [
                ...generateDisplaySteps((recipeToShow.steps || []).filter(step => !step.isEjectDripper), waterAmount),
                ...(dripperEjectStep ? generateDisplaySteps([dripperEjectStep], waterAmount) : [])
              ];
              setSelectedRecipe({ ...recipeToShow, steps: stepsForTimer, waterAmount })
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
              {/* ドリッパーを外すステップ（あれば） */}
              {dripperEjectStepDisplay && (
                <div className="flex gap-3 items-start text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {stepsToShow.length + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {dripperEjectStepDisplay.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-500">ステップが登録されていません。</div>
          )}
        </div>
      </div>
    </main>
  )
}
