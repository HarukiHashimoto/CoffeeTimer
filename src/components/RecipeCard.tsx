'use client'

import { Recipe } from '@/types/recipe'
import Link from 'next/link'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <h2 className="text-2xl font-semibold mb-2 text-emerald-600 dark:text-emerald-600">{recipe.name}</h2>
      <div className="text-gray-600 space-y-2">
        <p className="text-sm">{recipe.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">Method:</span> {recipe.method}
          </div>
          <div>
            <span className="font-medium">Time:</span> {recipe.totalTime} min
          </div>
        </div>
      </div>
    </Link>
  )
}
