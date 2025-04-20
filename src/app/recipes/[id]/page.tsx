'use client'

import { recipes } from '@/data/recipes'
import { useRecipe } from '@/contexts/RecipeContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import WaterAmountSelector from '@/components/WaterAmountSelector'
import { SIMPLE_DRIP_STEPS, OSMOTIC_FLOW_STEPS, calculateRecipeAmounts } from '@/utils/recipeCalculator'

interface Props {
  params: {
    id: string
  },
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function RecipePage({ params }: Props) {
  const { setSelectedRecipe } = useRecipe()
  const router = useRouter()
  const [waterAmount, setWaterAmount] = useState(300)
  const recipe = recipes.find(r => r.id === params.id)
  if (!recipe) {
    return (
      <main className="min-h-screen p-8">
        <div>Recipe not found</div>
        <Link href="/recipes" className="text-emerald-600 hover:text-emerald-700">
          ← Back to Recipes
        </Link>
      </main>
    )
  }

  // レシピに基づいて水量の計算を行う
  const calculateRecipe = (baseRecipe: typeof recipes[0]) => {
    if (!baseRecipe) return null

    let steps = [...(baseRecipe.steps || [])]
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
    }

    return {
      ...baseRecipe,
      ratio: `1:15 （コーヒー${coffee}g：お湯${waterAmount}g）`,
      steps
    }
  }

  const currentRecipe = calculateRecipe(recipe)
  if (!currentRecipe) return null

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/recipes" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to recipes
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
        <p className="text-gray-600">{recipe.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">Method</div>
            <div className="text-gray-600">{recipe.method}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Ratio</div>
            <div className="text-gray-600">{recipe.ratio}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Grind Size</div>
            <div className="text-gray-600">{recipe.grindSize}</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">Total Time</div>
            <div className="text-gray-600">{recipe.totalTime} minutes</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{step.description}</p>
                  <div className="text-sm text-gray-600 space-x-4">
                    {step.duration && (
                      <span>{step.duration} seconds</span>
                    )}
                    {step.waterAmount && (
                      <span>{step.waterAmount}g water</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
