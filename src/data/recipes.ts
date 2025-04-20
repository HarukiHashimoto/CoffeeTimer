import { Recipe } from '@/types/recipe'

export const recipes: Recipe[] = [
  {
    id: 'v60',
    name: 'Hario V60',
    method: 'Drip',
    description:
      'A classic pour-over method using the Hario V60 dripper. Known for its clean and bright cup profile.',
    ratio: '1:15',
    grindSize: '中挨き',
    totalTime: 2.5,
    steps: [
      { description: '事前準備', duration: 30 },
      { description: '蒸らし', duration: 30, amount: 30 },
      { description: '蒸らし待ち', duration: 30 },
      { description: '1回目の注ぎ', duration: 20, amount: 95 },
      { description: '抽出待ち', duration: 20 },
      { description: '2回目の注ぎ', duration: 20, amount: 100 },
      { description: '抽出待ち', duration: 20 },
      { description: 'ドリッパーを外す' }
    ],
    image: '/recipes/v60.jpg'
  },
  {
    id: 'tetsu-4-6',
    name: 'テツ式4:6メソッド',
    method: 'ハリオV60',
    description: '粕谷哲氏考案の4:6メソッド。お好みに合わせて抽出方法をカスタマイズできます。',
    ratio: '1:15（カスタマイズ可能）',
    grindSize: '中粗挽き',
    totalTime: 3.5,
    steps: [
      { description: '※このレシピは専用ページでカスタマイズできます' }
    ],
    image: '/recipes/v60.jpg'
  },
  {
    id: 'osmotic-flow',
    name: 'オスモティックフロー',
    method: 'ハリオV60',
    description: '一定の流れで注ぎ続けることで、クリーンで甘みのある味わいを引き出す抽出方法です。',
    ratio: '1:16 （コーヒー15g：お湯240g）',
    grindSize: '中細挽き',
    totalTime: 3,
    steps: [
      { description: '00:00 蒸らし: 45gのお湯を注ぐ', duration: 15, waterAmount: 45 },
      { description: '00:15 蒸らしを待つ', duration: 45 },
      { description: '01:00 連続注水: 195gのお湯を円を描くように注ぐ', duration: 90, waterAmount: 195 },
      { description: '02:30 抽出を待つ', duration: 30 },
      { description: '03:00 ドリッパーを外す' }
    ],
    image: '/recipes/v60.jpg'
  }
]
