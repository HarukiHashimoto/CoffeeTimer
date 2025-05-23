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
    <div className={className}>
      <div className="text-center">
        <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-light-primary dark:text-dark-primary tracking-tighter tabular-nums font-[var(--font-roboto-mono)] mb-8">
          {formatTime(time)}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isRunning && time === 0 && (
            <button
              onClick={startTimer}
              className="px-8 py-3 text-lg font-medium rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:ring-light-primary dark:focus:ring-dark-primary"
            >
              Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={pauseTimer}
              className="px-8 py-3 text-lg font-medium rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface bg-light-secondary dark:bg-dark-secondary text-white hover:bg-light-secondary/90 dark:hover:bg-dark-secondary/90 focus:ring-light-secondary dark:focus:ring-dark-secondary"
            >
              Pause
            </button>
          )}
          {/* Show Reset button if not in initial state (i.e., if running or if paused but time > 0) */}
          {(!isRunning && time > 0) && ( // This condition ensures reset is shown when paused and time > 0
             <button
              onClick={startTimer} // Should be "Resume" or "Start" if we want to differentiate
              className="px-8 py-3 text-lg font-medium rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 focus:ring-light-primary dark:focus:ring-dark-primary"
            >
              Resume
            </button>
          )}
          {(isRunning || time > 0) && (
            <button
              onClick={resetTimer}
              className="px-8 py-3 text-lg font-medium rounded-lg shadow-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-surface border border-neutral-300 dark:border-neutral-600 text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-surface-secondary focus:ring-light-secondary dark:focus:ring-dark-secondary"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
