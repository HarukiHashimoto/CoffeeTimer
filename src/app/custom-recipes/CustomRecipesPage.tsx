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
        <main className="min-h-screen p-8 bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center">
          <div className="text-xl mb-4 text-light-text dark:text-dark-text">レシピが見つかりませんでした。</div>
          <Link href="/recipes" className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-light-bg dark:focus-visible:ring-offset-dark-bg">レシピ一覧へ戻る</Link>
        </main>
      )
    }
    return (
      <main className="min-h-screen p-8 bg-light-bg dark:bg-dark-bg">
        <div className="content-container mx-auto max-w-3xl">
          <RecipeDetail recipe={recipe} />
        </div>
      </main>
    )
  }

  // 一覧ページ
  return (
    <main className="min-h-screen p-8 bg-light-bg dark:bg-dark-bg mx-auto max-w-7xl">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-light-text dark:text-dark-text">カスタムレシピ一覧</h1>
      {customRecipes.length === 0 ? (
        <div className="text-light-text/75 dark:text-dark-text/75">カスタムレシピがありません。</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customRecipes.map(recipe => (
            <div key={recipe.id} className="relative content-container"> {/* Applied content-container here */}
              <Link href={`/custom-recipes?id=${recipe.id}`} className="block">
                {/* RecipeDetail is already styled to fit within a content-container like context */}
                <RecipeDetail recipe={recipe} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
