'use client'

import { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{recipe.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{recipe.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div>抽出時間: {recipe.totalTime}分</div>
        <div>比率: {recipe.ratio}</div>
        <div>豆: {recipe.coffeeAmount}g</div>
        <div>湯: {recipe.waterAmount}g</div>
      </div>
    </div>
  )
}
