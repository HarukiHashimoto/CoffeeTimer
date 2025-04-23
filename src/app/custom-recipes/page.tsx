"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Recipe } from "@/types/recipe"
import RecipeDetail from "@/components/RecipeDetail"
import Link from "next/link"

export default function CustomRecipesPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const stored = localStorage.getItem("coffee-timer-custom-recipes")
    if (stored) {
      const parsed: Recipe[] = JSON.parse(stored)
      setCustomRecipes(parsed)
      if (id) {
        const found = parsed.find(r => r.id === id)
        setRecipe(found || null)
      }
    } else {
      setCustomRecipes([])
      setRecipe(null)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (id) {
    if (!recipe) {
      return (
        <main className="min-h-screen p-8 flex flex-col items-center justify-center">
          <div className="text-xl mb-4">レシピが見つかりませんでした。</div>
          <Link href="/recipes" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">レシピ一覧へ戻る</Link>
        </main>
      )
    }
    return (
      <main className="min-h-screen p-4">
        <RecipeDetail recipe={recipe} />
      </main>
    )
  }

  // 一覧ページ
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6 text-emerald-600">カスタムレシピ一覧</h1>
      {customRecipes.length === 0 ? (
        <div className="text-gray-500">カスタムレシピがありません。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customRecipes.map(recipe => (
            <div key={recipe.id} className="relative">
              <Link href={`/custom-recipes?id=${recipe.id}`} className="block">
                <RecipeDetail recipe={recipe} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
