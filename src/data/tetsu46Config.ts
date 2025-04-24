export interface Pour {
  name: string
  description: string
  ratios: number[]  // 注ぐ量の比率（合計が1になるように）
}

export const firstPours: Pour[] = [
  {
    name: 'ベーシック',
    description: 'バランスの取れた味わい',
    ratios: [0.5, 0.5]  // 60g, 60g (for 300g total)
  },
  {
    name: 'より甘く',
    description: '甘みを引き出す注ぎ方',
    ratios: [0.417, 0.583]  // 50g, 70g
  },
  {
    name: 'より明るく',
    description: '酸味を引き立てる注ぎ方',
    ratios: [0.583, 0.417]  // 70g, 50g
  }
]

export const secondPours: Pour[] = [
  {
    name: '薄く',
    description: 'さっぱりとした味わい',
    ratios: [1]
  },
  {
    name: '少し薄く',
    description: 'やや軽めの味わい',
    ratios: [0.5, 0.5]
  },
  {
    name: '濃く',
    description: 'コクのある味わい',
    ratios: [0.333, 0.333, 0.334]
  }
]

export interface PourStep {
  amount: number
  time: number
  cumulativeTime: number
}

interface CalculatePoursResult {
  firstSteps: PourStep[]
  secondSteps: PourStep[]
  recommendedCoffee: number
}

export function calculatePours(totalWater: number, firstPour: Pour, secondPour: Pour): CalculatePoursResult {
  const firstPart = totalWater * 0.4  // 全体の40%
  const secondPart = totalWater * 0.6  // 全体の60%
  const stepTime = 45  // 4:6メソッドの標準注ぎ時間
  
  const firstSteps = firstPour.ratios.map((ratio, index) => ({
    amount: Math.round(firstPart * ratio),
    time: stepTime,
    cumulativeTime: index * stepTime  // 経過時間を計算
  }))

  const firstTotalTime = firstSteps.reduce((sum, step) => sum + step.time, 0)

  // Second Pour Style (60%) 注湯タイミングを pour.name で分岐
  let secondStepTimes: number[] = [];
  if (secondPour.name === '薄く') {
    // そのまま（従来通り、1回のみ）
    secondStepTimes = [90]; // 01:30
  } else if (secondPour.name === '少し薄く') {
    secondStepTimes = [90, 150]; // 01:30, 02:30
  } else if (secondPour.name === '濃く') {
    secondStepTimes = [90, 135, 165]; // 01:30, 02:15, 02:45
  } else {
    // fallback: 従来のロジック
    secondStepTimes = secondPour.ratios.map((_, idx) => firstTotalTime + idx * stepTime);
  }

  const secondSteps = secondPour.ratios.map((ratio, index) => ({
    amount: Math.round(secondPart * ratio),
    time: index === 0 ? secondStepTimes[0] : secondStepTimes[index] - secondStepTimes[index - 1],
    cumulativeTime: secondStepTimes[index]
  }));

  return {
    firstSteps,
    secondSteps,
    recommendedCoffee: Math.round(totalWater / 15)  // 1:15の比率
  }
}
