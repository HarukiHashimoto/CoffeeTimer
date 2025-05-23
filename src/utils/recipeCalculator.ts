interface StepRatio {
  description: string
  ratio: number
  duration: number
}

export const WATER_RATIO = 15 // 1:15の比率

export const PRESET_AMOUNTS = [
  { label: '1杯分 (200g)', value: 200 },
  { label: '1-2杯分 (300g)', value: 300 },
  { label: '2-3杯分 (400g)', value: 400 },
  { label: '3-4杯分 (500g)', value: 500 }
]

// シンプルドリップのステップ比率
export const SIMPLE_DRIP_STEPS: StepRatio[] = [
  { description: '蒸らし', ratio: 0.133, duration: 10 }, // 30g/225g
  { description: '1回目', ratio: 0.422, duration: 20 }, // 95g/225g
  { description: '2回目', ratio: 0.445, duration: 20 } // 100g/225g
]

// オスモティックフローのステップ比率
export const OSMOTIC_FLOW_STEPS: StepRatio[] = [
  { description: '蒸らし', ratio: 0.1875, duration: 15 }, // 45g/240g
  { description: '連続注水', ratio: 0.8125, duration: 90 } // 195g/240g
]

export function calculateRecipeAmounts(totalWater: number, steps: StepRatio[]) {
  const coffee = Math.round(totalWater / WATER_RATIO)
  const waterAmounts = steps.map(step => ({
    ...step,
    waterAmount: Math.round(totalWater * step.ratio)
  }))
  
  return {
    coffee,
    waterAmounts,
    totalTime: waterAmounts.reduce((total, step) => total + step.duration, 0)
  }
}

// 4:6メソッドのステップを湯量から動的生成
type Tetsu46Step = { description: string; duration?: number; waterAmount?: number }
export function generateTetsu46Steps(totalWater: number): Tetsu46Step[] {
  const pourCount = 5
  const pourAmount = Math.round(totalWater / pourCount)
  const pourInterval = 45 // 4:6メソッドの標準注ぎ時間（秒）
  const steps: Tetsu46Step[] = []
  let currentSec = 0
  for (let i = 0; i < pourCount; i++) {
    const min = Math.floor(currentSec / 60)
    const sec = String(currentSec % 60).padStart(2, '0')
    steps.push({
      description: `${min}:${sec} ${pourAmount}g注ぐ`,
      duration: pourInterval,
      waterAmount: pourAmount
    })
    currentSec += pourInterval
  }
  steps.push({ description: '3:30 ドリッパーを外す' })
  return steps
}
