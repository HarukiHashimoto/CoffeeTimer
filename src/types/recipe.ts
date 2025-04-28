export interface Step {
  /**
   * 開始時間（秒）: カスタムレシピ編集画面で直接入力する。description生成やduration算出に利用。
   */
  startTime?: number;
  description: string;
  duration?: number;
  amount?: number;
  waterAmount?: number;
  pourPercentage?: number;  // 注湯量（全体の何%か）
  shouldSpin?: boolean;     // このステップでスピンするか
  isEjectDripper?: boolean; // ドリッパーを外す専用ステップか
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
