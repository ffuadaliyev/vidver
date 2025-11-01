'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-secondary">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Xəta</CardTitle>
            <CardDescription>Profil yüklənə bilmədi</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>Ana səhifə</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <span className="text-sm text-neutral-secondary">Token:</span>
              <span className="font-heading font-bold text-neon-lime">{profile.tokenBalance}</span>
            </div>
            <Link href="/image">
              <Button variant="outline" size="sm">Şəkil</Button>
            </Link>
            <Link href="/video">
              <Button variant="outline" size="sm">Video</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">
            Xoş gəldiniz, {profile.user.name}!
          </h1>
          <p className="text-neutral-secondary">
            Token balansınız: <span className="text-neon-lime font-bold">{profile.tokenBalance}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="gradient-border hover:shadow-2xl transition-all cursor-pointer" onClick={() => router.push('/image')}>
            <CardHeader>
              <CardTitle className="text-electric-cyan">🚗 Şəkil Tuning</CardTitle>
              <CardDescription>4 tərəfdən şəkil yükləyib AI ilə tuning tətbiq edin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-secondary mb-4">
                Cost: <span className="text-neon-lime font-bold">20 token</span>
              </p>
              <Button className="w-full">Başla</Button>
            </CardContent>
          </Card>

          <Card className="gradient-border hover:shadow-2xl transition-all cursor-pointer" onClick={() => router.push('/video')}>
            <CardHeader>
              <CardTitle className="text-neon-lime">🎬 Video Generator</CardTitle>
              <CardDescription>Şəkildən effektli videolar yaradın</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-secondary mb-4">
                Cost: <span className="text-neon-lime font-bold">50 token</span>
              </p>
              <Button className="w-full">Başla</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">Son işlər</h2>

          {profile.recentJobs && profile.recentJobs.length > 0 ? (
            <div className="space-y-4">
              {profile.recentJobs.map((job: any) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{job.kind === 'IMAGE' ? '🚗' : '🎬'}</span>
                          <div>
                            <h3 className="font-semibold">
                              {job.kind === 'IMAGE' ? 'Şəkil Tuning' : 'Video Generator'}
                            </h3>
                            {job.brand && job.model && (
                              <p className="text-sm text-neutral-secondary">
                                {job.brand} {job.model}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-secondary">
                          <span>{formatDate(job.createdAt)}</span>
                          <span>•</span>
                          <span className={
                            job.status === 'DONE' ? 'text-green-400' :
                            job.status === 'FAILED' ? 'text-red-400' :
                            'text-yellow-400'
                          }>
                            {job.status === 'DONE' ? '✓ Tamamlandı' :
                             job.status === 'FAILED' ? '✗ Xəta' :
                             '⏳ İşlənir'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-secondary">Token</p>
                        <p className="font-heading font-bold text-lg">-{job.costTokens}</p>
                      </div>
                    </div>

                    {job.outputAssets && job.outputAssets.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-4 gap-2">
                          {job.outputAssets.slice(0, 4).map((asset: any, idx: number) => (
                            <div key={asset.id} className="aspect-video bg-onyx-light rounded-lg overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center text-neutral-secondary text-xs">
                                {asset.side || `Result ${idx + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-neutral-secondary mb-4">Hələ heç bir iş yoxdur</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/image">
                    <Button>Şəkil Tuning</Button>
                  </Link>
                  <Link href="/video">
                    <Button variant="outline">Video Generator</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
