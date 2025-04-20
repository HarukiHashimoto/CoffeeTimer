'use client'

import { useState, useEffect } from 'react'

export default function TimerComponent() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const startTimer = () => {
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(0)
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="text-8xl font-bold text-center mb-4 tabular-nums font-[var(--font-roboto-mono)]">
          {formatTime(time)}
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopTimer}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Stop
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-600 transition-colors font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
