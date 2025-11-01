'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LoadingCarProgress } from '@/components/LoadingCarProgress'
import { UploadBox } from '@/components/UploadBox'
import { VIDEO_EFFECTS } from '@/lib/constants'

interface UploadedImage {
  file: File
  preview: string
}

export default function VideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [resultVideo, setResultVideo] = useState<string | null>(null)

  const handleUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview })
    setMessage('')
  }

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setMessage('Zəhmət olmasa şəkil yükləyin')
      return
    }

    if (!selectedEffect) {
      setMessage('Zəhmət olmasa effekt seçin')
      return
    }

    setLoading(true)
    setMessage('Video generasiya olunur...')

    // Simulate 5s video generation
    setTimeout(() => {
      // For testing, return the same image as "video result"
      setResultVideo(uploadedImage.preview)
      setMessage('Video uğurla yaradıldı!')
      setLoading(false)
    }, 5000)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setSelectedEffect('')
    setResultVideo(null)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link href="/image">
              <Button variant="outline" size="sm">Şəkil</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Video Generator
            </h1>
            <p className="text-sm md:text-base text-neutral-secondary">
              Şəkildən effektli videolar yaradın
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <LoadingCarProgress message="Video generasiya olunur..." duration={5000} />
                {message && (
                  <p className="text-center mt-6 text-sm text-neutral-secondary">
                    {message}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : resultVideo ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Nəticəsi</CardTitle>
                  <CardDescription>
                    Video uğurla yaradıldı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-neutral-secondary mb-2">Orijinal Şəkil</p>
                      <img
                        src={uploadedImage?.preview}
                        alt="Orijinal"
                        className="w-full h-64 md:h-80 object-cover rounded-lg border border-border"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-2">Video Nəticəsi (Test)</p>
                      <div className="relative">
                        <img
                          src={resultVideo}
                          alt="Video Nəticə"
                          className="w-full h-64 md:h-80 object-cover rounded-lg border border-electric-cyan"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <div className="text-center">
                            <div className="text-6xl mb-2">▶️</div>
                            <p className="text-sm text-white font-medium">
                              {VIDEO_EFFECTS.find(e => e.key === selectedEffect)?.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {message && (
                    <p className="text-sm text-green-500 mt-4 text-center">{message}</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={handleReset}>
                  Yenidən başla
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Dashboard-a get
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Şəkil yükləyin</CardTitle>
                  <CardDescription>
                    Video yaratmaq üçün avtomobil şəkli yükləyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        src={uploadedImage.preview}
                        alt="Yüklənmiş şəkil"
                        className="w-full h-64 md:h-80 object-cover rounded-lg border border-primary"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Dəyiş
                      </button>
                    </div>
                  ) : (
                    <UploadBox
                      label="Avtomobil şəkli yükləyin"
                      onUpload={handleUpload}
                      accept="image/jpeg,image/png,image/webp"
                      maxSize={5}
                    />
                  )}
                  {message && !loading && !uploadedImage && (
                    <p className="text-sm text-amber-500 mt-4">{message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Video Effects */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Video effekti seçin</CardTitle>
                  <CardDescription>
                    Videonuz üçün effekt seçin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {VIDEO_EFFECTS.map((effect) => (
                      <button
                        key={effect.key}
                        onClick={() => setSelectedEffect(effect.key)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedEffect === effect.key
                            ? 'border-electric-cyan bg-electric-cyan/5'
                            : 'border-border hover:border-electric-cyan/50'
                        }`}
                      >
                        <h3 className="font-heading font-semibold text-base md:text-lg mb-1">
                          {effect.title}
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-secondary line-clamp-2">
                          {effect.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  {message && !loading && selectedEffect && (
                    <p className="text-sm text-amber-500 mt-4">{message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Action */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-secondary">Token cost</p>
                      <p className="font-heading text-2xl font-bold text-electric-cyan">50 token</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={!uploadedImage || !selectedEffect}
                      className="w-full md:w-auto px-8"
                    >
                      Video yarat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
