'use client'

import { PRESET_AMOUNTS } from '@/utils/recipeCalculator'

interface Props {
  value: number
  onChange: (value: number) => void
}

export default function WaterAmountSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
          Total Water Amount
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min="100"
            max="1000"
            step="10"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
          />
          <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 shadow-sm">
            g
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              value === preset.value
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
