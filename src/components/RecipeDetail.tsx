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
    <div>
      <Link href="/recipes" className="text-light-secondary dark:text-dark-secondary hover:underline mb-4 inline-block text-base font-medium">
        ← Back to recipes
      </Link>

      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-light-text dark:text-dark-text">{recipe.name}</h1>

      <div className="space-y-8">
        <div className="p-6">
          <button
            className="mb-6 w-full px-6 py-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg shadow font-bold hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition-colors text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-light-surface dark:focus-visible:ring-offset-dark-surface"
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
          <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">レシピ詳細</h2>
          <p className="text-light-text/90 dark:text-dark-text/90 mb-4 whitespace-pre-line">{recipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
            <div>
              <div className="font-medium text-light-text dark:text-dark-text">比率</div>
              <div className="text-light-text/75 dark:text-dark-text/75">{recipe.ratio}</div>
            </div>
            <div>
              <div className="font-medium text-light-text dark:text-dark-text">挽き目</div>
              <div className="text-light-text/75 dark:text-dark-text/75">{recipe.grindSize}</div>
            </div>
            <div>
              <div className="font-medium text-light-text dark:text-dark-text">コーヒー豆</div>
              <div className="text-light-text/75 dark:text-dark-text/75">{recipe.coffeeAmount ? `${recipe.coffeeAmount}g` : '-'}</div>
            </div>
            <div>
              <div className="font-medium text-light-text dark:text-dark-text">お湯</div>
              <div className="text-light-text/75 dark:text-dark-text/75">{recipe.waterAmount ? `${recipe.waterAmount}g` : '-'}</div>
            </div>
            <div>
              <div className="font-medium text-light-text dark:text-dark-text">抽出完了時間</div>
              <div className="text-light-text/75 dark:text-dark-text/75">
                {recipe.drainageSettings?.drainageDuration !== undefined
                  ? `${Math.floor(recipe.drainageSettings.drainageDuration / 60)}分${recipe.drainageSettings.drainageDuration % 60}秒`
                  : '-'}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-light-text dark:text-dark-text">抽出ステップ</h2>
          {stepsToShow.length > 0 ? (
            <div className="space-y-3">
              {stepsToShow.map((step, index) => {
                const cumulative = getCumulativeWaterAmount(stepsToShow, index);
                return (
                  <div key={index} className="mb-3 flex gap-3 items-start text-sm">
                    <div className="w-5 h-5 rounded-full bg-light-primary dark:bg-dark-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-light-text dark:text-dark-text">
                        {step.description}
                      </div>
                      <div className="text-xs text-light-text/75 dark:text-dark-text/75">
                        合計: {cumulative}g
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* ドリッパーを外すステップ（あれば） */}
              {dripperEjectStepDisplay && (
                <div className="flex gap-3 items-start text-sm">
                  <div className="w-5 h-5 rounded-full bg-light-primary dark:bg-dark-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {stepsToShow.length + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-light-text dark:text-dark-text">
                      {dripperEjectStepDisplay.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-light-text/60 dark:text-dark-text/60">ステップが登録されていません。</div>
          )}
        </div>
      </div>
    </div>
  )
}
