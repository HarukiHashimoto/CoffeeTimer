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
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
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
            className="flex-1 px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-surface-secondary text-light-text dark:text-dark-text border border-neutral-300 dark:border-neutral-600 shadow-sm focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-transparent sm:text-sm"
          />
          <span className="inline-flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-light-bg dark:bg-dark-surface-secondary text-light-text/75 dark:text-dark-text/75 shadow-sm">
            g
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface ${
              value === preset.value
                ? 'bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:ring-light-primary dark:focus:ring-dark-primary'
                : 'bg-light-surface dark:bg-dark-surface border border-neutral-300 dark:border-neutral-600 text-light-text dark:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-surface-secondary focus:ring-light-secondary dark:focus:ring-dark-secondary'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
