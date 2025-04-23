import { Recipe } from '@/types/recipe'

export const recipes: Recipe[] = [
  {
    id: 'tetsu-4-6',
    name: '4:6メソッド',
    method: 'ハリオV60',
    description: '粕谷哲氏考案の4:6メソッド。お好みに合わせて抽出方法をカスタマイズできます。',
    ratio: '1:15（カスタマイズ可能）',
    grindSize: '中粗挽き',
    totalTime: 3.5,
    steps: [
      { description: '0:00 60g注ぐ', duration: 45, waterAmount: 60 },
      { description: '0:45 60g注ぐ', duration: 45, waterAmount: 60 },
      { description: '1:30 60g注ぐ', duration: 45, waterAmount: 60 },
      { description: '2:15 60g注ぐ', duration: 30, waterAmount: 60 },
      { description: '2:45 60g注ぐ', duration: 45, waterAmount: 60 },
      { description: '3:30 ドリッパーを外す' }
    ],
    image: '/recipes/v60.jpg'
  }
]
