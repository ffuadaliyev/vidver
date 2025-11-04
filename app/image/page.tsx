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

const COLOR_PALETTE = [
  // Reds
  { name: 'Parlaq Qırmızı', value: '#FF0000', hex: 'bright red' },
  { name: 'Tünd Qırmızı', value: '#8B0000', hex: 'dark red' },
  { name: 'Kardinal Qırmızı', value: '#C41E3A', hex: 'cardinal red' },
  { name: 'Bordo', value: '#800020', hex: 'burgundy' },

  // Oranges
  { name: 'Narıncı', value: '#FF8C00', hex: 'orange' },
  { name: 'Tünd Narıncı', value: '#FF4500', hex: 'dark orange' },
  { name: 'Coral', value: '#FF7F50', hex: 'coral' },

  // Yellows
  { name: 'Parlaq Sarı', value: '#FFD700', hex: 'bright yellow' },
  { name: 'Limon Sarı', value: '#FFF700', hex: 'lemon yellow' },
  { name: 'Qızıl', value: '#FFD700', hex: 'gold' },

  // Greens
  { name: 'Lime Yaşıl', value: '#32CD32', hex: 'lime green' },
  { name: 'Meşə Yaşıl', value: '#228B22', hex: 'forest green' },
  { name: 'Tünd Yaşıl', value: '#006400', hex: 'dark green' },
  { name: 'Zümrüd', value: '#50C878', hex: 'emerald' },

  // Blues
  { name: 'Göy', value: '#00CED1', hex: 'cyan' },
  { name: 'Parlaq Mavi', value: '#0000FF', hex: 'bright blue' },
  { name: 'Tünd Mavi', value: '#00008B', hex: 'navy blue' },
  { name: 'Kral Mavisi', value: '#4169E1', hex: 'royal blue' },
  { name: 'Açıq Göy', value: '#87CEEB', hex: 'sky blue' },

  // Purples & Pinks
  { name: 'Bənövşəyi', value: '#800080', hex: 'purple' },
  { name: 'Indigo', value: '#4B0082', hex: 'indigo' },
  { name: 'Magenta', value: '#FF00FF', hex: 'magenta' },
  { name: 'Çəhrayı', value: '#FFC0CB', hex: 'pink' },

  // Neutrals & Metallics
  { name: 'Qara', value: '#000000', hex: 'black' },
  { name: 'Ağ', value: '#FFFFFF', hex: 'white' },
  { name: 'Gümüşü', value: '#C0C0C0', hex: 'silver' },
  { name: 'Boz', value: '#808080', hex: 'gray' },
  { name: 'Tünd Boz', value: '#404040', hex: 'dark gray' },
  { name: 'Qəhvəyi', value: '#8B4513', hex: 'brown' },
  { name: 'Bej', value: '#F5F5DC', hex: 'beige' },
  { name: 'Şampan', value: '#F7E7CE', hex: 'champagne' },
]

export default function ImagePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)

  // Tuning selections
  const [activeTab, setActiveTab] = useState<'tuning' | 'color'>('tuning')
  const [isUmumi, setIsUmumi] = useState(false)
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<typeof COLOR_PALETTE[0] | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<'sport' | 'classic' | ''>('')

  // Auth check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=/image')
    }
  }, [status, router])

  const handleUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview })
    setMessage('')
    setResultImage(null)
  }

  const handlePartToggle = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter(p => p !== part))
    } else {
      setSelectedParts([...selectedParts, part])
    }
  }

  const handleUmumiToggle = () => {
    setIsUmumi(!isUmumi)
    if (!isUmumi) {
      setSelectedParts([]) // Clear individual parts when Ümumi is selected
    }
  }

  const generatePrompt = () => {
    let prompt = 'Keep the car in its exact original location, environment, background, lighting, and setting. Preserve all camera angle and perspective. '

    const modifications: string[] = []
    const hasColorChange = !!selectedColor
    const hasTuningParts = isUmumi || selectedParts.length > 0

    // If ONLY color is being changed (no tuning parts)
    if (hasColorChange && !hasTuningParts) {
      prompt += `Change ONLY the car's paint color to ${selectedColor.hex}. `
      prompt += 'Keep absolutely everything else identical: body shape, wheels, lights, bumpers, spoilers, interior, reflections, surroundings. '
      prompt += 'The car should look exactly the same except for the paint color. '
    }
    // If tuning parts are selected
    else {
      prompt += 'Modify ONLY the following parts, keep everything else exactly the same: '

      // Tuning parts
      if (isUmumi) {
        modifications.push('complete full body kit')
      } else if (selectedParts.length > 0) {
        const partMap: { [key: string]: string } = {
          'bumper': 'front and rear bumpers',
          'lights': 'headlights and taillights',
          'hood': 'hood',
          'roof': 'roof and roof spoiler',
          'doors': 'side skirts and door panels'
        }
        selectedParts.forEach(part => {
          if (partMap[part]) modifications.push(partMap[part])
        })
      }

      // Color (when combined with tuning)
      if (selectedColor) {
        modifications.push(`car paint color to ${selectedColor.hex}`)
      }

      prompt += modifications.join(', ') + '. '

      // Style applies ONLY to selected parts
      if (selectedStyle === 'sport') {
        prompt += 'Apply aggressive sport styling and racing aerodynamics ONLY to the modified parts. '
      } else if (selectedStyle === 'classic') {
        prompt += 'Apply elegant classic styling and vintage design elements ONLY to the modified parts. '
      }

      prompt += 'Keep all unselected parts in their original state. '
    }

    prompt += 'Maintain photorealistic quality, high detail, 4k resolution. '
    prompt += 'The result must look natural and professionally tuned, not artificially generated. '

    return prompt
  }

  const handleProcess = async () => {
    if (!uploadedImage) {
      setMessage('Zəhmət olmasa şəkil yükləyin')
      return
    }

    if (activeTab === 'tuning' && !isUmumi && selectedParts.length === 0) {
      setMessage('Zəhmət olmasa tuning seçimi edin')
      return
    }

    if (activeTab === 'color' && !selectedColor) {
      setMessage('Zəhmət olmasa rəng seçin')
      return
    }

    if (!selectedStyle) {
      setMessage('Zəhmət olmasa stil seçin')
      return
    }

    setLoading(true)
    setMessage('AI işləyir...')

    try {
      const prompt = generatePrompt()

      // Prepare form data for KIE.AI API
      const formData = new FormData()
      formData.append('image', uploadedImage.file)
      formData.append('prompt', prompt)
      formData.append('style', selectedStyle)

      // Add tuning data
      if (isUmumi) {
        formData.append('tuning', 'complete')
      } else {
        formData.append('tuning', JSON.stringify(selectedParts))
      }

      // Add color data
      if (selectedColor) {
        formData.append('color', selectedColor.hex)
      }

      // Call our API endpoint (which will call KIE.AI)
      const response = await fetch('/api/image-tuning', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Tuning uğursuz oldu')
      }

      const data = await response.json()

      if (data.resultUrl) {
        setResultImage(data.resultUrl)
        setMessage('Tuning tamamlandı!')
      } else {
        throw new Error('Nəticə alına bilmədi')
      }

      setLoading(false)
    } catch (error: any) {
      console.error('Tuning error:', error)
      setMessage('Xəta: ' + (error.message || 'Bir xəta baş verdi'))
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResultImage(null)
    setIsUmumi(false)
    setSelectedParts([])
    setSelectedColor(null)
    setSelectedStyle('')
    setMessage('')
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCarProgress message="Yüklənir..." />
      </div>
    )
  }

  // Don't render if not authenticated
  if (!session) {
    return null
  }

  const parts = [
    { id: 'bumper', label: 'Bufer' },
    { id: 'lights', label: 'İşıqlar' },
    { id: 'hood', label: 'Kapot' },
    { id: 'roof', label: 'Dam' },
    { id: 'doors', label: 'Qapılar' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
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
              AI Şəkil Tuning
            </h1>
            <p className="text-sm md:text-base text-neutral-secondary">
              Avtomobilinizin şəklini yükləyib AI ilə professional tuning tətbiq edin
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-12">
                <LoadingCarProgress message="AI tuning tətbiq edir..." duration={30000} />
                {message && (
                  <p className="text-center mt-6 text-sm text-neutral-secondary">
                    {message}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : resultImage ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nəticə</CardTitle>
                  <CardDescription>AI tərəfindən yaradılmış tuning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-neutral-secondary mb-3">Orijinal</p>
                      <img
                        src={uploadedImage!.preview}
                        alt="Original"
                        className="w-full rounded-lg border border-border"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-secondary mb-3 flex items-center gap-2">
                        <span className="bg-neon-lime/20 text-neon-lime px-2 py-1 rounded text-xs font-bold">AI</span>
                        Nəticə
                      </p>
                      <img
                        src={resultImage}
                        alt="Result"
                        className="w-full rounded-lg border border-neon-lime"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Yenidən başla
                </Button>
                <Button onClick={() => router.push('/dashboard')} className="flex-1">
                  Dashboard-a get
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Şəkil yükləyin</CardTitle>
                  <CardDescription>Avtomobilinizin şəklini yükləyin</CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        src={uploadedImage.preview}
                        alt="Uploaded"
                        className="w-full max-w-md mx-auto rounded-lg border border-primary"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-4 right-4"
                        onClick={() => setUploadedImage(null)}
                      >
                        Sil
                      </Button>
                    </div>
                  ) : (
                    <UploadBox
                      label="Avtomobil şəkli"
                      onUpload={handleUpload}
                      accept="image/jpeg,image/png,image/webp"
                      maxSize={5 * 1024 * 1024}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Tuning/Color Tabs */}
              {uploadedImage && (
                <Card>
                  <CardHeader>
                    <CardTitle>2. Dəyişiklik seçin</CardTitle>
                    <CardDescription>Tuning və ya rəng dəyişikliyi seçin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-6">
                      <Button
                        variant={activeTab === 'tuning' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('tuning')}
                      >
                        Tuning
                      </Button>
                      <Button
                        variant={activeTab === 'color' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('color')}
                      >
                        Rəng
                      </Button>
                    </div>

                    {/* Tuning Tab */}
                    {activeTab === 'tuning' && (
                      <div className="space-y-4">
                        {/* Ümumi Checkbox */}
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-neon-lime/10 border-2 border-neon-lime/30">
                          <input
                            type="checkbox"
                            id="umumi"
                            checked={isUmumi}
                            onChange={handleUmumiToggle}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <label htmlFor="umumi" className="text-lg font-semibold cursor-pointer">
                            Ümumi (Tam body kit)
                          </label>
                        </div>

                        {/* Individual Parts */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {parts.map((part) => (
                            <div
                              key={part.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                isUmumi
                                  ? 'bg-background/30 border-border/30 opacity-50 cursor-not-allowed'
                                  : selectedParts.includes(part.id)
                                  ? 'bg-electric-cyan/10 border-electric-cyan'
                                  : 'bg-background/50 border-border hover:border-primary cursor-pointer'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={part.id}
                                checked={selectedParts.includes(part.id)}
                                onChange={() => handlePartToggle(part.id)}
                                disabled={isUmumi}
                                className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <label
                                htmlFor={part.id}
                                className={`font-medium ${isUmumi ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {part.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Tab */}
                    {activeTab === 'color' && (
                      <div className="space-y-4">
                        <p className="text-sm text-neutral-secondary">Avtomobil üçün rəng seçin - Rəng tonlarının geniş spektri</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {COLOR_PALETTE.map((color) => (
                            <button
                              key={color.hex}
                              onClick={() => setSelectedColor(color)}
                              className={`relative aspect-square rounded-lg transition-all ${
                                selectedColor?.hex === color.hex
                                  ? 'ring-4 ring-neon-lime scale-110'
                                  : 'hover:scale-105 ring-2 ring-border'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            >
                              {selectedColor?.hex === color.hex && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl drop-shadow-lg">✓</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {selectedColor && (
                          <p className="text-center text-sm font-medium mt-4">
                            Seçilmiş rəng: <span className="text-neon-lime">{selectedColor.name}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Style Selection */}
              {uploadedImage && (
                <Card>
                  <CardHeader>
                    <CardTitle>3. Stil seçin</CardTitle>
                    <CardDescription>Tuning stili</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedStyle('sport')}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          selectedStyle === 'sport'
                            ? 'bg-neon-lime/20 border-neon-lime'
                            : 'bg-background/50 border-border hover:border-primary'
                        }`}
                      >
                        <div className="text-4xl mb-3">🏎️</div>
                        <h3 className="text-xl font-bold mb-2">Sport</h3>
                        <p className="text-sm text-neutral-secondary">Aggressive styling, racing aerodynamics</p>
                      </button>

                      <button
                        onClick={() => setSelectedStyle('classic')}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          selectedStyle === 'classic'
                            ? 'bg-neon-lime/20 border-neon-lime'
                            : 'bg-background/50 border-border hover:border-primary'
                        }`}
                      >
                        <div className="text-4xl mb-3">🚗</div>
                        <h3 className="text-xl font-bold mb-2">Klasik</h3>
                        <p className="text-sm text-neutral-secondary">Elegant styling, vintage design elements</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Process Button */}
              {uploadedImage && (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleProcess}
                    disabled={loading}
                    className="w-full md:w-auto px-12 h-14 text-lg font-bold animate-pulse-glow"
                  >
                    <span className="mr-2">🚀</span>
                    AI Tuning Başlat
                  </Button>
                </div>
              )}

              {message && !loading && (
                <p className="text-center text-sm text-amber-500">{message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
