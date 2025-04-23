"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Recipe } from "@/types/recipe"
import RecipeDetail from "@/components/RecipeDetail"
import Link from "next/link"

export default function CustomRecipeDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    try {
      const stored = localStorage.getItem("coffee-timer-custom-recipes")
      if (stored) {
        const customRecipes: Recipe[] = JSON.parse(stored)
        const found = customRecipes.find(r => r.id === id)
        setRecipe(found || null)
      }
    } catch {
      setRecipe(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </main>
    )
  }

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
