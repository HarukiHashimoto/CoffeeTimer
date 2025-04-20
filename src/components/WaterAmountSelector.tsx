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
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
            g
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              value === preset.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
