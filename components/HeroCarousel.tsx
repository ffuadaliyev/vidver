'use client'

import { useState, useEffect } from 'react'

const carouselItems = [
  {
    title: 'AI ilə Professional Tuning',
    description: 'Avtomobilinizə realistik body kit, diskler və rənglər əlavə edin',
    icon: '🚗',
    gradient: 'from-neon-lime to-electric-cyan',
  },
  {
    title: 'Effektli Video Generasiya',
    description: 'Şəkildən dinamik və effektli videolar yaradın',
    icon: '🎬',
    gradient: 'from-electric-cyan to-purple-500',
  },
  {
    title: 'Saniyələrlə Hazır Nəticə',
    description: '5 saniyə ərzində professional keyfiyyətli nəticə',
    icon: '⚡',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: '4 Tərəfdən Görünüş',
    description: 'Ön, arxa, sağ və sol tərəfdən tam tuning',
    icon: '📸',
    gradient: 'from-pink-500 to-neon-lime',
  },
]

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-12">
      <div className="relative h-64 md:h-72 overflow-hidden rounded-2xl">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === activeIndex
                ? 'opacity-100 translate-x-0 scale-100'
                : index < activeIndex
                ? 'opacity-0 -translate-x-full scale-95'
                : 'opacity-0 translate-x-full scale-95'
            }`}
          >
            <div
              className={`h-full w-full bg-gradient-to-br ${item.gradient} p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-7xl md:text-8xl mb-6 animate-bounce-slow">
                  {item.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 ${
              index === activeIndex
                ? 'w-12 h-3 bg-neon-lime'
                : 'w-3 h-3 bg-neutral-secondary/30 hover:bg-neutral-secondary/50'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
