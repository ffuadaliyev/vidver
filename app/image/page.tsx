'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LoadingCarProgress } from '@/components/LoadingCarProgress'
import { UploadBox } from '@/components/UploadBox'

interface UploadedImage {
  file: File
  preview: string
}

interface ProcessedResult {
  side: string
  original: string
  result: string
}

interface Brand {
  id: string
  name: string
  slug: string
  models: Model[]
}

interface Model {
  id: string
  name: string
  slug: string
}

export default function ImagePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadedImages, setUploadedImages] = useState<{
    front?: UploadedImage
    rear?: UploadedImage
    left?: UploadedImage
    right?: UploadedImage
  }>({})
  const [results, setResults] = useState<ProcessedResult[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [availableModels, setAvailableModels] = useState<Model[]>([])

  // Auth check - redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=/image')
    }
  }, [status, router])

  // Load catalog data
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await fetch('/api/catalog')
        const data = await response.json()
        if (data.brands) {
          setBrands(data.brands)
        }
      } catch (error) {
        console.error('Failed to load catalog:', error)
      }
    }
    loadCatalog()
  }, [])

  // Update available models when brand changes
  useEffect(() => {
    if (selectedBrandId) {
      const brand = brands.find(b => b.id === selectedBrandId)
      setAvailableModels(brand?.models || [])
      setSelectedModelId('') // Reset model selection
    } else {
      setAvailableModels([])
      setSelectedModelId('')
    }
  }, [selectedBrandId, brands])

  const handleUpload = (side: 'front' | 'rear' | 'left' | 'right') => (file: File, preview: string) => {
    setUploadedImages(prev => ({
      ...prev,
      [side]: { file, preview }
    }))
  }

  const handleProcess = async () => {
    const uploadedCount = Object.keys(uploadedImages).length
    if (uploadedCount === 0) {
      setMessage('Zəhmət olmasa ən azı 1 şəkil yükləyin')
      return
    }

    setLoading(true)
    setMessage('AI modeli şəkilləri işləyir...')

    // Simulate 5s processing
    setTimeout(() => {
      // Return same images as results (for testing)
      const processedResults: ProcessedResult[] = []

      if (uploadedImages.front) {
        processedResults.push({
          side: 'Ön',
          original: uploadedImages.front.preview,
          result: uploadedImages.front.preview
        })
      }
      if (uploadedImages.rear) {
        processedResults.push({
          side: 'Arxa',
          original: uploadedImages.rear.preview,
          result: uploadedImages.rear.preview
        })
      }
      if (uploadedImages.left) {
        processedResults.push({
          side: 'Sol',
          original: uploadedImages.left.preview,
          result: uploadedImages.left.preview
        })
      }
      if (uploadedImages.right) {
        processedResults.push({
          side: 'Sağ',
          original: uploadedImages.right.preview,
          result: uploadedImages.right.preview
        })
      }

      setResults(processedResults)
      setMessage('Modifikasiya tamamlandı!')
      setLoading(false)
    }, 5000)
  }

  const handleReset = () => {
    setUploadedImages({})
    setResults([])
    setMessage('')
  }

  const sideLabels = {
    front: 'Ön',
    rear: 'Arxa',
    left: 'Sol',
    right: 'Sağ'
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCarProgress message="Yüklənir..." />
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null
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
            <Link href="/video">
              <Button variant="outline" size="sm">Video</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm">Profil</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-12 px-4 md:px-6 lg:px-8 pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Şəkil Tuning
            </h1>
            <p className="text-sm md:text-base text-neutral-secondary">
              4 tərəfdən şəkil yükləyib AI ilə tuning tətbiq edin
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <LoadingCarProgress message="AI modeli işləyir..." />
                {message && (
                  <p className="text-center mt-6 text-sm text-neutral-secondary">
                    {message}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nəticələr</CardTitle>
                  <CardDescription>
                    Modifikasiya olunmuş şəkillər
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {results.map((result, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="font-semibold text-lg">{result.side}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-neutral-secondary mb-2">Orijinal</p>
                            <img
                              src={result.original}
                              alt={`${result.side} - Orijinal`}
                              className="w-full h-48 md:h-64 object-cover rounded-lg border border-border"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-secondary mb-2">Nəticə</p>
                            <img
                              src={result.result}
                              alt={`${result.side} - Nəticə`}
                              className="w-full h-48 md:h-64 object-cover rounded-lg border border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Şəkil yükləyin</CardTitle>
                  <CardDescription>
                    Avtomobilinizin 4 tərəfdən şəkillərini yükləyin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.keys(sideLabels) as Array<keyof typeof sideLabels>).map((side) => (
                      <div key={side}>
                        {uploadedImages[side] ? (
                          <div className="relative">
                            <img
                              src={uploadedImages[side]!.preview}
                              alt={sideLabels[side]}
                              className="w-full h-48 object-cover rounded-lg border border-primary"
                            />
                            <div className="absolute top-2 left-2 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
                              {sideLabels[side]}
                            </div>
                            <button
                              onClick={() => {
                                setUploadedImages(prev => {
                                  const updated = { ...prev }
                                  delete updated[side]
                                  return updated
                                })
                              }}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <UploadBox
                            label={sideLabels[side]}
                            onUpload={handleUpload(side)}
                            accept="image/jpeg,image/png,image/webp"
                            maxSize={5 * 1024 * 1024}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {message && !loading && (
                    <p className="text-sm text-amber-500 mt-4">{message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Brand/Model Section */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Marka və Model (isteğe bağlı)</CardTitle>
                  <CardDescription>
                    Avtomobilinizin marka və modelini seçin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Marka</label>
                      <select
                        className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm"
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                      >
                        <option value="">Marka seçin</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <select
                        className="w-full h-11 rounded-lg border border-input bg-background px-4 text-sm"
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        disabled={!selectedBrandId || availableModels.length === 0}
                      >
                        <option value="">
                          {selectedBrandId ? 'Model seçin' : 'Əvvəlcə marka seçin'}
                        </option>
                        {availableModels.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tuning Options */}
              <Card>
                <CardHeader>
                  <CardTitle>3. Tuning seçimləri (isteğe bağlı)</CardTitle>
                  <CardDescription>
                    İstədiyiniz tuning elementlərini seçin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Body Kit', 'Disk/Rim', 'Spoyler', 'Kapot', 'Rəng/Wrap', 'Xenon'].map((item) => (
                      <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-secondary">Token cost</p>
                      <p className="font-heading text-2xl font-bold text-neon-lime">20 token</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleProcess}
                      className="w-full md:w-auto px-8"
                      disabled={Object.keys(uploadedImages).length === 0}
                    >
                      Modifikasiya et
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
