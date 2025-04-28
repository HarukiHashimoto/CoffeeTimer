import { Step } from '@/types/recipe'
import TimerComponent from '@/components/TimerComponent'
import TimerStepsDisplay from './TimerStepsDisplay'
import { useRecipe } from '@/contexts/RecipeContext'
import { useState } from 'react'

export default function Tetsu46Timer() {
  const { selectedRecipe } = useRecipe()
  const [currentTime, setCurrentTime] = useState(0)

  // 4:6メソッド専用の進行ロジックをここに
  const steps: Step[] = selectedRecipe?.steps || []

  // ... 必要な4:6メソッド特有の計算や表示

  return (
    <div>
      <TimerComponent onTimeUpdate={setCurrentTime} onReset={() => setCurrentTime(0)} />
      <div className="mt-6">
        <TimerStepsDisplay steps={steps} currentTime={currentTime} />
      </div>
    </div>
  )
}
