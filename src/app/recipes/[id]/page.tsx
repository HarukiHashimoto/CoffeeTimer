'use client'

import { useState, useEffect } from 'react'
import { recipes as defaultRecipes } from '@/data/recipes'
import { Recipe } from '@/types/recipe'
import Link from 'next/link'
import RecipeDetail from '@/components/RecipeDetail'
import Tetsu46Customizer from '@/components/Tetsu46Customizer'

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecipe = async () => {
      // まずデフォルトレシピを確認
      const defaultRecipe = defaultRecipes.find(r => r.id === params.id)
      if (defaultRecipe) {
        setRecipe(defaultRecipe)
        setLoading(false)
        return
      }

      // カスタムレシピを読み込む
      try {
        const response = await fetch('/custom-recipes.json')
        if (response.ok) {
          const customRecipes = await response.json()
          const customRecipe = customRecipes.find((r: Recipe) => r.id === params.id)
          setRecipe(customRecipe)
        }
      } catch (error) {
        console.error('Failed to load custom recipe:', error)
      }
      setLoading(false)
    }

    loadRecipe()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </main>
    )
  }
  if (!recipe) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex items-center justify-between mb-8">
          <div>Recipe not found</div>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            トップに戻る
          </Link>
        </div>
      </main>
    )
  }

  // 4:6メソッドの場合は直接カスタマイズコンポーネントを表示
  if (recipe.id === 'tetsu-4-6') {
    return (
      <main className="min-h-screen p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-6">4:6メソッド</h1>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            トップに戻る
          </Link>
        </div>
        <Tetsu46Customizer />
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" viewBox="0 0 200 148.813">
            <path className="fill-emerald-600" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
          </svg>
          <h1 className="text-2xl font-bold">Recipe Details</h1>
        </div>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          トップに戻る
        </Link>
      </div>
      <RecipeDetail recipe={recipe} />
    </main>
  )
}
