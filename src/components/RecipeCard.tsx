'use client'

import { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg hover:shadow-xl dark:border dark:border-dark-surface-secondary transition-all duration-200 transform hover:scale-105">
      <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">{recipe.name}</h3>
      <p className="text-sm text-light-text/75 dark:text-dark-text/75 mb-4 line-clamp-3">{recipe.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-light-text/60 dark:text-dark-text/60">
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
