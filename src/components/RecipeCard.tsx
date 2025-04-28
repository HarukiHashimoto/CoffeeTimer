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
        <div>抽出時間: {(() => {
          if (recipe.isCustom && recipe.steps && recipe.steps.length > 0) {
            const ejectStep = recipe.steps.find(s => s.isEjectDripper);
            if (ejectStep && typeof ejectStep.startTime === 'number') {
              const min = Math.floor(ejectStep.startTime / 60);
              const sec = ejectStep.startTime % 60;
              return `${min}:${String(sec).padStart(2, '0')}`;
            }
            // fallback: 最後のstepの終了時刻
            const lastStep = recipe.steps[recipe.steps.length - 1];
            if (lastStep) {
              const endTime = (lastStep.startTime || 0) + (lastStep.duration || 0);
              const min = Math.floor(endTime / 60);
              const sec = endTime % 60;
              return `${min}:${String(sec).padStart(2, '0')}`;
            }
          }
          // 通常レシピ
          return `${recipe.totalTime}分`;
        })()}</div>
        <div>比率: {recipe.ratio}</div>
        <div>豆: {recipe.coffeeAmount}g</div>
        <div>湯: {recipe.waterAmount}g</div>
      </div>
    </div>
  )
}
