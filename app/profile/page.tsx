'use client'

import { useState, useEffect } from 'react'
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
    email: string | null
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
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'transactions'>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

      // Load profile
      const profileRes = await fetch('/api/profile')
      if (!profileRes.ok) throw new Error('Failed to load profile')
      const profileData = await profileRes.json()
      setProfile(profileData)

      // Load jobs
      const jobsRes = await fetch('/api/jobs')
      if (!jobsRes.ok) throw new Error('Failed to load jobs')
      const jobsData = await jobsRes.json()
      setJobs(jobsData.jobs || [])

      // Load token transactions
      const txRes = await fetch('/api/tokens/history')
      if (!txRes.ok) throw new Error('Failed to load transactions')
      const txData = await txRes.json()
      setTransactions(txData.transactions || [])

      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Xəta baş verdi')
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Show loading while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCarProgress message="Yüklənir..." />
      </div>
    )
  }

  // Don't render if not authenticated
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
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-heading text-xl md:text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link href="/image">
              <Button variant="outline" size="sm">Şəkil</Button>
            </Link>
            <Link href="/video">
              <Button variant="outline" size="sm">Video</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-6 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Profil
            </h1>
            <p className="text-sm md:text-base text-neutral-secondary">
              Hesab məlumatlarınız və statistikanız
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500">
              {error}
            </div>
          )}

          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-lime to-electric-cyan flex items-center justify-center text-4xl font-bold text-onyx">
                    {profile.user.name?.charAt(0).toUpperCase() || profile.user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold mb-1">
                    {profile.user.name || 'İstifadəçi'}
                  </h2>
                  <p className="text-neutral-secondary mb-4">
                    {profile.user.email}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Token Balansı</p>
                      <p className="font-heading text-2xl font-bold text-neon-lime">
                        {profile.tokenWallet.balance}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Ümumi İşlər</p>
                      <p className="font-heading text-2xl font-bold">
                        {profile.stats.totalJobs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Tamamlanmış</p>
                      <p className="font-heading text-2xl font-bold text-green-500">
                        {profile.stats.completedJobs}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-secondary mb-1">Üzv olma</p>
                      <p className="text-sm font-medium">
                        {new Date(profile.user.createdAt).toLocaleDateString('az-AZ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="flex-shrink-0">
                  <Button variant="outline" onClick={handleSignOut}>
                    Çıxış
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
            >
              Ümumi
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Şəxsi Məlumatlar</CardTitle>
                  <CardDescription>Hesab məlumatlarınız</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Ad</label>
                        <p className="mt-1 font-medium">{profile.user.name || 'Təyin edilməyib'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">E-poçt</label>
                        <p className="mt-1 font-medium">{profile.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Qeydiyyat Tarixi</label>
                        <p className="mt-1 font-medium">{formatDate(profile.user.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-secondary">Son Giriş</label>
                        <p className="mt-1 font-medium">
                          {profile.user.lastLoginAt ? formatDate(profile.user.lastLoginAt) : 'Məlumat yoxdur'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Token Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Token Statistikası</CardTitle>
                  <CardDescription>Token istifadə məlumatlarınız</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-neon-lime/10 border border-neon-lime/20">
                      <p className="text-sm text-neutral-secondary mb-2">Cari Balans</p>
                      <p className="font-heading text-4xl font-bold text-neon-lime">
                        {profile.tokenWallet.balance}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-neutral-secondary mb-2">Ümumi Qazanılan</p>
                      <p className="font-heading text-4xl font-bold text-green-500">
                        {profile.tokenWallet.totalEarned}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-neutral-secondary mb-2">Ümumi Xərclənən</p>
                      <p className="font-heading text-4xl font-bold text-red-500">
                        {profile.tokenWallet.totalSpent}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Fəaliyyətlər</CardTitle>
                  <CardDescription>Son işləriniz</CardDescription>
                </CardHeader>
                <CardContent>
                  {jobs.length === 0 ? (
                    <p className="text-center text-neutral-secondary py-8">
                      Hələ heç bir iş yoxdur
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {jobs.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${getJobStatusBadge(job.status)}`} />
                            <div>
                              <p className="font-medium">{job.kind === 'IMAGE' ? 'Şəkil Tuning' : 'Video Generator'}</p>
                              <p className="text-sm text-neutral-secondary">{formatDate(job.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm px-3 py-1 rounded-full ${getJobStatusBadge(job.status)}`}>
                              {job.status}
                            </p>
                            <p className="text-sm text-neutral-secondary mt-1">-{job.cost} token</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                      <div key={job.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getJobStatusBadge(job.status)}`} />
                          <div>
                            <p className="font-medium">{job.kind === 'IMAGE' ? 'Şəkil Tuning' : 'Video Generator'}</p>
                            <p className="text-sm text-neutral-secondary">{formatDate(job.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm px-3 py-1 rounded-full inline-block ${getJobStatusBadge(job.status)}`}>
                            {job.status}
                          </p>
                          <p className="text-sm text-neutral-secondary mt-1">-{job.cost} token</p>
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
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                        <div>
                          <p className="font-medium">
                            {tx.type === 'PURCHASE' && 'Token Alışı'}
                            {tx.type === 'REWARD' && 'Mükafat'}
                            {tx.type === 'SPEND' && 'İstifadə'}
                            {tx.description && ` - ${tx.description}`}
                          </p>
                          <p className="text-sm text-neutral-secondary">{formatDate(tx.createdAt)}</p>
                        </div>
                        <div className="text-right">
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
