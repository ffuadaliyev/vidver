'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingCarProgressProps {
  message?: string
  duration?: number
}

export function LoadingCarProgress({
  message = "AI modeli işləyir...",
  duration = 5000
}: LoadingCarProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + (100 / (duration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        {/* Car Animation */}
        <div className="relative h-24 bg-onyx-light rounded-2xl overflow-hidden border border-border">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-lime/20 to-electric-cyan/20"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />

          {/* Car Icon */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-0"
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.1 }}
          >
            <div className="text-4xl -ml-8">🚗</div>
          </motion.div>

          {/* Road Lines */}
          <div className="absolute inset-0 flex items-center gap-4 px-4 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-neutral-secondary rounded-full" />
            ))}
          </div>
        </div>

        {/* Progress Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-secondary">{message}</span>
            <span className="text-neon-lime font-heading font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="h-2 bg-onyx-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-lime to-electric-cyan"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-center space-y-1">
          <p className="text-sm text-neutral-secondary">
            {progress < 25 && "Şəkillər yüklənir..."}
            {progress >= 25 && progress < 50 && "AI modeli işləyir..."}
            {progress >= 50 && progress < 75 && "Tuning tətbiq edilir..."}
            {progress >= 75 && progress < 100 && "Nəticələr hazırlanır..."}
            {progress >= 100 && "Tamamlandı! ✨"}
          </p>
        </div>
      </div>
    </div>
  )
}
