'use client'

import { useState, useEffect } from 'react'

interface TimerComponentProps {
  onTimeUpdate: (time: number) => void
  onReset?: () => void
  className?: string
}

export default function TimerComponent({ onTimeUpdate, onReset, className = '' }: TimerComponentProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        const newTime = time + 1
        setTime(newTime)
        onTimeUpdate(newTime)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, time, onTimeUpdate])

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
    onTimeUpdate(0)
    onReset?.()
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-800 tracking-tighter tabular-nums font-[var(--font-roboto-mono)] mb-4 dark:text-gray-200">
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-4">
          {!isRunning && time === 0 && (
            <button
              onClick={startTimer}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-base transition-colors"
            >
              Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-base transition-colors"
            >
              Pause
            </button>
          )}
          {(isRunning || time > 0) && (
            <button
              onClick={resetTimer}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-base transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
