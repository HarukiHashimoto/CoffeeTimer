export interface Step {
  description: string;
  duration?: number;
  amount?: number;
  waterAmount?: number;
  pourPercentage?: number;  // 注湯量（全体の何%か）
  shouldSpin?: boolean;     // このステップでスピンするか
}

export interface DrainageSettings {
  shouldDrainCompletely: boolean;  // 完全に落としきるか
  drainageDuration?: number;       // 落としきり時間（秒）
}

export interface Recipe {
  id: string;
  name: string;
  method: string;
  description: string;
  ratio: string;
  coffeeAmount: number;     // コーヒー豆の量(g)
  waterAmount: number;      // 湯量(g)
  grindSize: string;
  totalTime: number;        // minutes
  steps: Step[];
  image: string;
  isCustom?: boolean;       // カスタムレシピかどうか
  drainageSettings?: DrainageSettings;
  metadata?: {
    firstPour?: Pour;
    secondPour?: Pour;
  };
}

export interface Pour {
  name: string;
  description: string;
  // その他のPourに関連するプロパティ
}
