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
      const timeStr = formatTime(drainTime);
      stepsWithoutEject.push({
        description: `${timeStr} - ドリッパーを外す（落としきる）`,
        duration: drainTime,
        shouldSpin: false,
        isEjectDripper: true,
        waterAmount: undefined,
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
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">カスタムレシピの作成</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">レシピ名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">コーヒー豆の量 (g)</label>
            <input
              type="number"
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">湯量 (g)</label>
            <input
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">挽き目</label>
          <select
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">抽出ステップ</label>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              ステップを追加
            </button>
          </div>
          
          {steps.filter(step => !step.isEjectDripper).map((step, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">ステップ {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  削除
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300">開始時間</label>
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
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="分"
                    />
                    <span className="self-center">分</span>
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
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="秒"
                    />
                    <span className="self-center">秒</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300">注湯量 (%)</label>
                  <input
                    type="number"
                    value={step.pourPercentage || 0}
                    onChange={(e) => handleUpdateStep(index, { ...step, pourPercentage: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`spin-${index}`}
                  checked={step.shouldSpin || false}
                  onChange={(e) => handleUpdateStep(index, { ...step, shouldSpin: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor={`spin-${index}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  このステップでスピンする
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">落としきる</label>
<div className="flex items-center">
  <input
    type="checkbox"
    id="drain-completely"
    checked={drainageSettings.shouldDrainCompletely}
    onChange={(e) => setDrainageSettings({
      ...drainageSettings,
      shouldDrainCompletely: e.target.checked
    })}
    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
  />
  <label htmlFor="drain-completely" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
    落としきる
  </label>
</div>

{drainageSettings.shouldDrainCompletely && (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300">ドリッパーを外す</label>
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
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="分"
      />
      <span className="self-center">分</span>
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
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        placeholder="秒"
      />
      <span className="self-center">秒</span>
    </div>
  </div>
)}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700"
        >
          保存
        </button>
      </div>
    </div>
  )
}
