import { Step } from '@/types/recipe'
import TimerComponent from '@/components/TimerComponent'
import TimerStepsDisplay from './TimerStepsDisplay'
import { useRecipe } from '@/contexts/RecipeContext'
import { useState } from 'react'

export default function GenericRecipeTimer() {
  const { selectedRecipe } = useRecipe()
  const [currentTime, setCurrentTime] = useState(0)

  // 汎用レシピ用の進行ロジック
  const steps: Step[] = selectedRecipe?.steps || []

  // Debug: Log selectedRecipe and steps
  console.log('selectedRecipe:', selectedRecipe);
  console.log('steps:', steps);

  return (
    <div>
      <TimerComponent onTimeUpdate={setCurrentTime} onReset={() => setCurrentTime(0)} />
      <div className="mt-6">
        <TimerStepsDisplay steps={steps} currentTime={currentTime} />
      </div>
    </div>
  )
}
