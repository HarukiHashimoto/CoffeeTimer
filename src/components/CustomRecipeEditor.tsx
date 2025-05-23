'use client'

import { useState } from 'react'
import { Recipe, Step, DrainageSettings } from '@/types/recipe'

interface Props {
  onSave: (recipe: Recipe) => void
  onCancel: () => void
  initialRecipe?: Recipe
}

export default function CustomRecipeEditor({ onSave, onCancel, initialRecipe }: Props) {
  const [name, setName] = useState(initialRecipe?.name || '')
  const [description, setDescription] = useState(initialRecipe?.description || '')
  const [coffeeAmount, setCoffeeAmount] = useState(initialRecipe?.coffeeAmount || 20)
  const [waterAmount, setWaterAmount] = useState(initialRecipe?.waterAmount || 300)
  const [grindSize, setGrindSize] = useState(initialRecipe?.grindSize || '中粗挽き')
  // isEjectDripper: true なステップは通常編集リストから除外
  const [steps, setSteps] = useState<Step[]>(
    (initialRecipe?.steps || []).filter((s) => !s.isEjectDripper)
  )
  const [drainageSettings, setDrainageSettings] = useState<DrainageSettings>(
    initialRecipe?.drainageSettings || {
      shouldDrainCompletely: true,
      drainageDuration: 30
    }
  )

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        description: '',
        duration: 30,
        pourPercentage: 0,
        shouldSpin: false
      }
    ])
  }

  const handleUpdateStep = (index: number, updatedStep: Step) => {
    const newSteps = [...steps]
    newSteps[index] = updatedStep
    setSteps(newSteps)
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSave = () => {
    const totalWater = waterAmount;
    let cumulativeTime = 0;
    // startTimeを昇順でソート
    const sortedSteps = steps.filter(s => !s.isEjectDripper).slice().sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
    const generatedSteps = sortedSteps.map((step, idx, arr) => {
      let desc = '';
      const timeStr = formatTime(step.startTime || 0);
      let waterAmt: number | undefined = undefined;
      if (step.pourPercentage && step.pourPercentage > 0) {
        waterAmt = Math.round(totalWater * (step.pourPercentage / 100));
        desc = `${timeStr} - ${waterAmt}g注ぐ`;
      } else if (step.shouldSpin) {
        desc = `${timeStr} - 攪拌する`;
      } else {
        desc = `${timeStr} - ${step.description || '（内容未設定）'}`;
      }
      // スピン有の場合は末尾に追加
      if (step.shouldSpin) {
        desc += '（スピン有）';
      }
      // durationは次のstep.startTimeとの差分、最後は0
      let duration = 0;
      if (idx < arr.length - 1) {
        duration = (arr[idx + 1].startTime || 0) - (step.startTime || 0);
        if (duration < 0) duration = 0;
      }
      return {
        ...step,
        description: desc,
        waterAmount: waterAmt,
        duration,
      };
    });
    // ドリッパー外し（落としきる）
    const stepsWithoutEject = generatedSteps.filter(s => !s.isEjectDripper);
    if (drainageSettings.shouldDrainCompletely) {
      const drainTime = drainageSettings.drainageDuration || 0;
      // ドリッパーを外すステップの開始時刻は drainageDuration（ダイアログで設定した値）
      const dripperEjectStartTime = drainTime;
      const timeStr = formatTime(dripperEjectStartTime);
      stepsWithoutEject.push({
        description: `${timeStr} - ドリッパーを外す（落としきる）`,
        duration: drainTime,
        shouldSpin: false,
        isEjectDripper: true,
        waterAmount: undefined,
        startTime: dripperEjectStartTime,
      });
    }
    const recipe: Recipe = {
      id: initialRecipe?.id || `custom-${Date.now()}`,
      name,
      method: 'ハリオV60',
      description,
      ratio: `1:${(waterAmount / coffeeAmount).toFixed(1)}`,
      coffeeAmount,
      waterAmount,
      grindSize,
      totalTime: stepsWithoutEject.reduce((acc, step) => acc + (step.duration || 0), 0) / 60,
      steps: stepsWithoutEject,
      drainageSettings,
      image: '/recipes/v60.jpg',
      isCustom: true
    };
    onSave(recipe);
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">カスタムレシピの作成</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text">レシピ名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text">コーヒー豆の量 (g)</label>
            <input
              type="number"
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text dark:text-dark-text">湯量 (g)</label>
            <input
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text">挽き目</label>
          <select
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          >
            <option value="極細挽き">極細挽き</option>
            <option value="細挽き">細挽き</option>
            <option value="中細挽き">中細挽き</option>
            <option value="中挽き">中挽き</option>
            <option value="中粗挽き">中粗挽き</option>
            <option value="粗挽き">粗挽き</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-light-text dark:text-dark-text">抽出ステップ</label>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1 text-sm bg-light-secondary dark:bg-dark-secondary text-white rounded-md hover:bg-light-secondary/90 dark:hover:bg-dark-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-secondary dark:focus:ring-offset-dark-surface"
            >
              ステップを追加
            </button>
          </div>

          {steps.filter(step => !step.isEjectDripper).map((step, index) => (
            <div key={index} className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-light-text dark:text-dark-text">ステップ {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium"
                >
                  削除
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-light-text dark:text-dark-text">開始時間</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      value={Math.floor((step.startTime || 0) / 60)}
                      onChange={e => {
                        const minutes = Number(e.target.value);
                        const seconds = (step.startTime || 0) % 60;
                        handleUpdateStep(index, { ...step, startTime: minutes * 60 + seconds });
                      }}
                      className="w-20 rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
                      placeholder="分"
                    />
                    <span className="self-center text-light-text dark:text-dark-text">分</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={(step.startTime || 0) % 60}
                      onChange={e => {
                        const seconds = Number(e.target.value);
                        const minutes = Math.floor((step.startTime || 0) / 60);
                        handleUpdateStep(index, { ...step, startTime: minutes * 60 + seconds });
                      }}
                      className="w-20 rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
                      placeholder="秒"
                    />
                    <span className="self-center text-light-text dark:text-dark-text">秒</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-light-text dark:text-dark-text">注湯量 (%)</label>
                  <input
                    type="number"
                    value={step.pourPercentage || 0}
                    onChange={(e) => handleUpdateStep(index, { ...step, pourPercentage: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`spin-${index}`}
                  checked={step.shouldSpin || false}
                  onChange={(e) => handleUpdateStep(index, { ...step, shouldSpin: e.target.checked })}
                  className="h-4 w-4 text-light-primary dark:text-dark-primary border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                />
                <label htmlFor={`spin-${index}`} className="ml-2 block text-sm text-light-text dark:text-dark-text">
                  このステップでスピンする
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-light-text dark:text-dark-text">ドリッパーを外す</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={Math.floor((drainageSettings.drainageDuration || 0) / 60)}
                onChange={e => {
                  const minutes = Number(e.target.value);
                  const seconds = (drainageSettings.drainageDuration || 0) % 60;
                  setDrainageSettings({ ...drainageSettings, drainageDuration: minutes * 60 + seconds });
                }}
                className="w-20 rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
                placeholder="分"
              />
              <span className="self-center text-light-text dark:text-dark-text">分</span>
              <input
                type="number"
                min={0}
                max={59}
                value={(drainageSettings.drainageDuration || 0) % 60}
                onChange={e => {
                  const seconds = Number(e.target.value);
                  const minutes = Math.floor((drainageSettings.drainageDuration || 0) / 60);
                  setDrainageSettings({ ...drainageSettings, drainageDuration: minutes * 60 + seconds });
                }}
                className="w-20 rounded-md py-2 px-3 bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
                placeholder="秒"
              />
              <span className="self-center text-light-text dark:text-dark-text">秒</span>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="drain-completely"
              checked={drainageSettings.shouldDrainCompletely}
              onChange={(e) => setDrainageSettings({
                ...drainageSettings,
                shouldDrainCompletely: e.target.checked
              })}
              className="h-4 w-4 text-light-primary dark:text-dark-primary border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            />
            <label htmlFor="drain-completely" className="ml-2 block text-sm text-light-text dark:text-dark-text">
              落としきる
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm hover:bg-neutral-100 dark:hover:bg-dark-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-secondary dark:focus:ring-offset-dark-surface"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-light-primary dark:bg-dark-primary border border-transparent rounded-md shadow-sm hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-offset-dark-surface"
        >
          保存
        </button>
      </div>
    </div>
  )
}
