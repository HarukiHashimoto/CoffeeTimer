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
    ratios: [1]  // 180g
  },
  {
    name: 'より濃く',
    description: 'コクのある味わい',
    ratios: [0.5, 0.5]  // 90g, 90g
  },
  {
    name: 'さらに濃く',
    description: '深いコクと強い味わい',
    ratios: [0.333, 0.333, 0.334]  // 60g, 60g, 60g
  }
]

export function calculatePours(totalWater: number, firstPour: Pour, secondPour: Pour) {
  const firstPart = totalWater * 0.4  // 全体の40%
  const secondPart = totalWater * 0.6  // 全体の60%
  
  const firstSteps = firstPour.ratios.map(ratio => ({
    amount: Math.round(firstPart * ratio)
  }))
  
  const secondSteps = secondPour.ratios.map(ratio => ({
    amount: Math.round(secondPart * ratio)
  }))

  return {
    firstSteps,
    secondSteps,
    recommendedCoffee: Math.round(totalWater / 15)  // 1:15の比率
  }
}
