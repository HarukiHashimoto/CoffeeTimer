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

  // ContextのselectedRecipeがあればそれを優先、なければprops.recipe
  const recipeToShow = selectedRecipe || recipe
  
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

  // レシピに基づいて水量の計算を行う
  const calculateRecipe = (baseRecipe: Recipe) => {
    let steps = [...(baseRecipe.steps || [])]
    
    // デバッグ用：baseRecipeの内容をコンソールに出力
    console.log('Debug - baseRecipe:', JSON.stringify(baseRecipe, null, 2))
    const coffee = Math.round(waterAmount / 15)

    if (baseRecipe.id === 'basic-drip') {
      const { waterAmounts } = calculateRecipeAmounts(waterAmount, SIMPLE_DRIP_STEPS)
      steps = [
        { description: `00:00 蒸らし: ${waterAmounts[0].waterAmount}gのお湯を注ぐ`, duration: 10, waterAmount: waterAmounts[0].waterAmount },
        { description: '00:10 蒸らしを待つ', duration: 30 },
        { description: `00:40 1回目: ${waterAmounts[1].waterAmount}gのお湯を注ぐ`, duration: 20, waterAmount: waterAmounts[1].waterAmount },
        { description: '01:00 抽出を待つ', duration: 20 },
        { description: `01:20 2回目: ${waterAmounts[2].waterAmount}gのお湯を注ぐ`, duration: 20, waterAmount: waterAmounts[2].waterAmount },
        { description: '01:40 抽出を待つ', duration: 20 },
        { description: '02:00 ドリッパーを外す' }
      ]
    } else if (baseRecipe.id === 'osmotic-flow') {
      const { waterAmounts } = calculateRecipeAmounts(waterAmount, OSMOTIC_FLOW_STEPS)
      steps = [
        { description: `00:00 蒸らし: ${waterAmounts[0].waterAmount}gのお湯を注ぐ`, duration: 15, waterAmount: waterAmounts[0].waterAmount },
        { description: '00:15 蒸らしを待つ', duration: 45 },
        { description: `01:00 連続注水: ${waterAmounts[1].waterAmount}gのお湯を円を描くように注ぐ`, duration: 90, waterAmount: waterAmounts[1].waterAmount },
        { description: '02:30 抽出を待つ', duration: 30 },
        { description: '03:00 ドリッパーを外す' }
      ]
    } else if (baseRecipe.id === 'tetsu-4-6') {
      steps = generateTetsu46Steps(waterAmount)
    }

    return {
      ...baseRecipe,
      ratio: `1:15 （コーヒー${coffee}g：お湯${waterAmount}g）`,
      steps
    }
  }

  const currentRecipe = calculateRecipe(recipeToShow)
  
  // デバッグ用：currentRecipeの内容をコンソールに出力
  console.log('Debug - currentRecipe:', JSON.stringify(currentRecipe, null, 2))

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/recipes" className="text-emerald-600 hover:text-emerald-700">
        ← Back to Recipes
      </Link>

      <h1 className="text-4xl font-bold mb-6">{recipe.name}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {recipe.id !== 'tetsu-4-6' && (
          <WaterAmountSelector
            value={waterAmount}
            onChange={setWaterAmount}
          />
        )}
        <button
          onClick={() => {
            setSelectedRecipe(currentRecipe)
            router.push('/timer')
          }}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium mb-6"
        >
          Use This Recipe
        </button>

        <div>
          <h2 className="text-lg font-medium mb-2">Method</h2>
          <p>{currentRecipe.method}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p>{currentRecipe.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Coffee to Water Ratio</h2>
          <p>{currentRecipe.ratio}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Grind Size</h2>
          <p>{currentRecipe.grindSize}</p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Steps</h2>
          <p>Total Steps: {currentRecipe.steps.length}</p>
          <ol className="list-decimal list-inside space-y-2">
            {currentRecipe.steps.map((step, index) => (
              <li key={index} className="pl-2 whitespace-pre-line">
                <div style={{color: '#888', fontSize: '0.8em'}}>
                  Debug: {JSON.stringify(step)}
                </div>
                <span>{step.description}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  )
}
