'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LoadingCarProgress } from '@/components/LoadingCarProgress'

interface Job {
  id: string
  kind: string
  status: string
  createdAt: string
  costTokens: number
  inputAssets?: Array<{
    id: string
    url: string
    side?: string
    type: string
  }>
  outputAssets?: Array<{
    id: string
    url: string
    side?: string
    type: string
    meta?: string
  }>
}

interface TokenTransaction {
  id: string
  type: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  createdAt: string
  description?: string
}

interface Asset {
  id: string
  type: string
  url: string
  side?: string
  createdAt: string
  job: {
    id: string
    kind: string
    status: string
    createdAt: string
  }
}

interface ProfileData {
  user: {
    id: string
    name: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    image: string | null
    createdAt: string
    lastLoginAt: string | null
  }
  tokenWallet: {
    balance: number
    totalEarned: number
    totalSpent: number
  }
  stats: {
    totalJobs: number
    completedJobs: number
    processingJobs: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [activeTab, setActiveTab] = useState<'personal' | 'jobs' | 'transactions' | 'gallery'>('personal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })

  // Auth check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in?callbackUrl=/profile')
    }
  }, [status, router])

  // Load profile data
  useEffect(() => {
    if (session) {
      loadProfileData()
    }
  }, [session])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError('')

      const profileRes = await fetch('/api/profile')
      if (!profileRes.ok) {
        throw new Error('Profile yüklənmədi')
      }
      const profileData = await profileRes.json()

      const transformedProfile = {
        user: {
          id: profileData.user.id,
          name: profileData.user.name,
          firstName: profileData.user.firstName || null,
          lastName: profileData.user.lastName || null,
          email: profileData.user.email,
          phone: profileData.user.phone || null,
          image: profileData.user.image,
          createdAt: profileData.user.createdAt,
          lastLoginAt: profileData.user.lastLoginAt || null,
        },
        tokenWallet: {
          balance: profileData.tokenBalance || 0,
          totalEarned: profileData.tokenBalance || 0,
          totalSpent: 0,
        },
        stats: {
          totalJobs: 0,
          completedJobs: 0,
          processingJobs: 0,
        },
      }

      setProfile(transformedProfile)
      setFormData({
        firstName: transformedProfile.user.firstName || '',
        lastName: transformedProfile.user.lastName || '',
        phone: transformedProfile.user.phone || '',
      })

      // Load jobs
      try {
        const jobsRes = await fetch('/api/jobs')
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json()
          setJobs(jobsData.jobs || [])

          if (jobsData.jobs && jobsData.jobs.length > 0) {
            transformedProfile.stats.totalJobs = jobsData.jobs.length
            transformedProfile.stats.completedJobs = jobsData.jobs.filter((j: any) => j.status === 'completed').length
            transformedProfile.stats.processingJobs = jobsData.jobs.filter((j: any) => j.status === 'processing').length
            setProfile(transformedProfile)
          }
        }
      } catch (e) {
        console.log('Jobs API not available')
      }

      // Load token transactions
      try {
        const txRes = await fetch('/api/tokens/history')
        if (txRes.ok) {
          const txData = await txRes.json()
          setTransactions(txData.transactions || [])
        }
      } catch (e) {
        console.log('Token history API not available')
      }

      // Load assets (gallery images)
      try {
        const assetsRes = await fetch('/api/assets')
        if (assetsRes.ok) {
          const assetsData = await assetsRes.json()
          setAssets(assetsData.assets || [])
        }
      } catch (e) {
        console.log('Assets API not available')
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Profile load error:', err)
      setError(err.message || 'Xəta baş verdi')
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Şəkil həcmi maksimum 2MB ola bilər')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Yalnız şəkil faylları qəbul edilir')
      return
    }

    try {
      setImageUploading(true)

      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string

        const res = await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String }),
        })

        if (!res.ok) throw new Error('Şəkil yüklənmədi')

        const data = await res.json()
        if (profile) {
          setProfile({
            ...profile,
            user: { ...profile.user, image: data.user.image },
          })
        }

        setImageUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Image upload error:', err)
      alert('Şəkil yüklənərkən xəta baş verdi')
      setImageUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Profil yenilənmədi')

      const data = await res.json()
      if (profile) {
        setProfile({
          ...profile,
          user: {
            ...profile.user,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
            name: data.user.name,
          },
        })
      }

      setIsEditing(false)
      setSaving(false)
    } catch (err) {
      console.error('Profile update error:', err)
      alert('Profil yenilənərkən xəta baş verdi')
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCarProgress message="Yüklənir..." />
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatTimeOnly = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getJobStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-500/20 text-green-500',
      processing: 'bg-yellow-500/20 text-yellow-500',
      failed: 'bg-red-500/20 text-red-500',
      pending: 'bg-blue-500/20 text-blue-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-500'
  }

  const getTransactionIcon = (type: string) => {
    if (type === 'PURCHASE' || type === 'REWARD') return '+'
    if (type === 'SPEND') return '-'
    return ''
  }

  const getTransactionColor = (type: string) => {
    if (type === 'PURCHASE' || type === 'INITIAL') return 'text-green-500'
    if (type === 'IMAGE_MODIFY' || type === 'VIDEO_GENERATE') return 'text-red-500'
    return 'text-neutral-text'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <Link href="/" className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link href="/image">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">Şəkil</Button>
            </Link>
            <Link href="/video">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">Video</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-12 px-4 md:px-6 lg:px-8 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="mb-4 md:mb-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Profil
            </h1>
            <p className="text-sm md:text-base text-neutral-secondary">
              Hesab məlumatlarınız və statistikanız
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500">
              {error}
            </div>
          )}

          {/* Profile Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0 relative group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-lime to-electric-cyan flex items-center justify-center text-4xl font-bold text-onyx overflow-hidden cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    {profile?.user?.image ? (
                      <img src={profile.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile?.user?.name?.charAt(0).toUpperCase() || profile?.user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    <span className="text-white text-sm">Dəyiş</span>
                  </div>
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold mb-1">
                    {profile?.user?.name || 'İstifadəçi'}
                  </h2>
                  <p className="text-neutral-secondary mb-4">
                    {profile?.user?.email || ''}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Token Balansı</p>
                      <p className="font-heading text-2xl font-bold text-neon-lime">
                        {profile?.tokenWallet?.balance || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Ümumi İşlər</p>
                      <p className="font-heading text-2xl font-bold">
                        {profile?.stats?.totalJobs || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Tamamlanmış</p>
                      <p className="font-heading text-2xl font-bold text-green-500">
                        {profile?.stats?.completedJobs || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Üzv olma</p>
                      <p className="text-sm font-medium">
                        {profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString('az-AZ') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Button variant="outline" onClick={handleSignOut} className="w-full md:w-auto">
                    Çıxış
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'personal' ? 'default' : 'outline'}
              onClick={() => setActiveTab('personal')}
            >
              Şəxsi Məlumatlar
            </Button>
            <Button
              variant={activeTab === 'gallery' ? 'default' : 'outline'}
              onClick={() => setActiveTab('gallery')}
            >
              Qalereya ({jobs.filter(j => j.outputAssets && j.outputAssets.length > 0).reduce((sum, j) => sum + (j.outputAssets?.length || 0), 0)})
            </Button>
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'outline'}
              onClick={() => setActiveTab('jobs')}
            >
              Tarixçə ({jobs.length})
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('transactions')}
            >
              Token Əməliyyatları ({transactions.length})
            </Button>
          </div>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Şəxsi Məlumatlar</CardTitle>
                  <CardDescription>Hesab məlumatlarınızı yeniləyin</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                    Redaktə et
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ad</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary"
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Soyad</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary"
                          placeholder="Soyadınız"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mobil nömrə</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-primary"
                          placeholder="+994501234567"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-neutral-secondary">E-poçt (dəyişdirilə bilməz)</label>
                        <input
                          type="email"
                          value={profile?.user?.email || ''}
                          disabled
                          className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border text-neutral-secondary cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto">
                        {saving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: profile?.user?.firstName || '',
                            lastName: profile?.user?.lastName || '',
                            phone: profile?.user?.phone || '',
                          })
                        }}
                        disabled={saving}
                        className="w-full sm:w-auto"
                      >
                        Ləğv et
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Ad</label>
                        <p className="mt-1 font-medium">{profile?.user?.firstName || 'Təyin edilməyib'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Soyad</label>
                        <p className="mt-1 font-medium">{profile?.user?.lastName || 'Təyin edilməyib'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">E-poçt</label>
                        <p className="mt-1 font-medium">{profile?.user?.email || '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Mobil nömrə</label>
                        <p className="mt-1 font-medium">{profile?.user?.phone || 'Təyin edilməyib'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Qeydiyyat Tarixi</label>
                        <p className="mt-1 font-medium">{profile?.user?.createdAt ? formatDate(profile.user.createdAt) : '-'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Son Giriş</label>
                        <p className="mt-1 font-medium">
                          {profile?.user?.lastLoginAt ? formatDate(profile.user.lastLoginAt) : 'Məlumat yoxdur'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Jobs History Tab */}
          {activeTab === 'jobs' && (
            <Card>
              <CardHeader>
                <CardTitle>İş Tarixçəsi</CardTitle>
                <CardDescription>Bütün işlərinizin siyahısı</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <p className="text-center text-neutral-secondary py-8">
                    Hələ heç bir iş yoxdur
                  </p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => {
                      const outputAsset = job.outputAssets?.[0]
                      const metadata = outputAsset?.meta ? JSON.parse(outputAsset.meta) : null

                      return (
                        <div key={job.id} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition">
                          {/* Image Thumbnail */}
                          {outputAsset?.url && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-background">
                              <img
                                src={outputAsset.url}
                                alt="Result"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="font-medium">
                                  {job.kind === 'IMAGE_MODIFY' ? 'AI Şəkil Tuning' : 'Video Generator'}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-neutral-secondary mt-1">
                                  <span>{formatDateOnly(job.createdAt)}</span>
                                  <span>•</span>
                                  <span>{formatTimeOnly(job.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className={`text-xs px-2 py-1 rounded-full ${getJobStatusBadge(job.status)}`}>
                                  {job.status === 'DONE' ? 'Tamamlandı' : job.status === 'PROCESSING' ? 'İşlənir' : job.status}
                                </p>
                                <p className="text-sm font-medium text-red-500">-{job.costTokens} token</p>
                              </div>
                            </div>

                            {/* Modifications */}
                            {metadata && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {metadata.style && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-neon-lime/10 text-neon-lime border border-neon-lime/20">
                                    Stil: {metadata.style === 'sport' ? 'İdman' : 'Klassik'}
                                  </span>
                                )}
                                {metadata.color && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20">
                                    Rəng: {metadata.color}
                                  </span>
                                )}
                                {metadata.tuning && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    Tuning: {metadata.tuning}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Token Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card>
              <CardHeader>
                <CardTitle>Token Əməliyyatları</CardTitle>
                <CardDescription>Token hərəkətləriniz</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-neutral-secondary py-8">
                    Hələ heç bir əməliyyat yoxdur
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-background/50 gap-3">
                        <div className="flex-1">
                          <p className="font-medium">
                            {tx.type === 'INITIAL' && 'İlkin Token'}
                            {tx.type === 'PURCHASE' && 'Token Alışı'}
                            {tx.type === 'IMAGE_MODIFY' && 'AI Şəkil Tuning'}
                            {tx.type === 'VIDEO_GENERATE' && 'Video Generator'}
                            {tx.type === 'REFUND' && 'Geri Qaytarma'}
                            {tx.description && ` - ${tx.description}`}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-neutral-secondary mt-1">
                            <span>{formatDateOnly(tx.createdAt)}</span>
                            <span>•</span>
                            <span>{formatTimeOnly(tx.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`font-heading text-2xl font-bold ${getTransactionColor(tx.type)}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                          </p>
                          <div className="text-right">
                            <p className="text-xs text-neutral-secondary">Balans</p>
                            <p className="text-sm font-medium">{tx.balanceAfter}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <Card>
              <CardHeader>
                <CardTitle>Qalereya</CardTitle>
                <CardDescription>AI ilə hazırlanmış şəkillər</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const generatedImages = jobs
                    .filter(job => job.outputAssets && job.outputAssets.length > 0)
                    .flatMap(job => job.outputAssets!.map(asset => ({
                      ...asset,
                      jobId: job.id,
                      jobCreatedAt: job.createdAt,
                      metadata: asset.meta ? JSON.parse(asset.meta) : null
                    })))

                  return generatedImages.length === 0 ? (
                    <p className="text-center text-neutral-secondary py-8">
                      Hələ heç bir AI nəticəsi yoxdur
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {generatedImages.map((image) => (
                        <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-background/50 hover:ring-2 hover:ring-neon-lime transition-all">
                          <img
                            src={image.url}
                            alt="AI Generated"
                            className="w-full h-full object-cover"
                          />

                          {/* AI Badge */}
                          <div className="absolute top-2 right-2 bg-neon-lime/90 text-onyx px-2 py-1 rounded-full text-xs font-bold">
                            AI
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3">
                            <p className="text-white text-sm font-medium mb-1">✨ AI Generated</p>
                            <p className="text-white/70 text-xs mb-3">{new Date(image.jobCreatedAt).toLocaleDateString('az-AZ')}</p>

                            {/* Action Buttons */}
                            <div className="flex gap-2 w-full">
                              <a
                                href={image.url}
                                download={`vidver-ai-${image.id}.jpg`}
                                className="flex-1 px-3 py-2 bg-neon-lime text-onyx rounded-lg text-xs font-bold hover:bg-neon-lime/80 transition text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Endir
                              </a>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  if (confirm('Şəkli silmək istədiyinizə əminsiniz?')) {
                                    try {
                                      const res = await fetch(`/api/assets/${image.id}`, { method: 'DELETE' })
                                      if (res.ok) {
                                        loadProfileData()
                                      } else {
                                        alert('Şəkil silinə bilmədi')
                                      }
                                    } catch (err) {
                                      alert('Xəta baş verdi')
                                    }
                                  }
                                }}
                                className="px-3 py-2 bg-red-500/80 text-white rounded-lg text-xs font-bold hover:bg-red-500 transition"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
