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
  cost: number
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
  const [activeTab, setActiveTab] = useState<'personal' | 'jobs' | 'transactions'>('personal')
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
    if (type === 'PURCHASE' || type === 'REWARD') return 'text-green-500'
    if (type === 'SPEND') return 'text-red-500'
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
                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition gap-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getJobStatusBadge(job.status)}`} />
                          <div>
                            <p className="font-medium">{job.kind === 'IMAGE' ? 'Şəkil Tuning' : 'Video Generator'}</p>
                            <p className="text-sm text-neutral-secondary">{formatDate(job.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-7 sm:ml-0">
                          <p className={`text-sm px-3 py-1 rounded-full ${getJobStatusBadge(job.status)}`}>
                            {job.status}
                          </p>
                          <p className="text-sm text-neutral-secondary">-{job.cost} token</p>
                        </div>
                      </div>
                    ))}
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
                            {tx.type === 'PURCHASE' && 'Token Alışı'}
                            {tx.type === 'REWARD' && 'Mükafat'}
                            {tx.type === 'SPEND' && 'İstifadə'}
                            {tx.description && ` - ${tx.description}`}
                          </p>
                          <p className="text-sm text-neutral-secondary">{formatDate(tx.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`font-heading text-xl font-bold ${getTransactionColor(tx.type)}`}>
                            {getTransactionIcon(tx.type)}{Math.abs(tx.amount)}
                          </p>
                          <p className="text-sm text-neutral-secondary">
                            Balans: {tx.balanceAfter}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
