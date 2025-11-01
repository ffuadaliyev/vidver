'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
      return
    }

    // Check if user is admin
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-secondary">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if ((session?.user as any)?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai - Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">
            Admin Panel
          </h1>
          <p className="text-neutral-secondary">
            İstifadəçi, token və preset idarəetməsi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-electric-cyan">İstifadəçilər</CardTitle>
              <CardDescription>Aktiv istifadəçilər</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-bold mb-2">-</div>
              <p className="text-sm text-neutral-secondary">Ümumi istifadəçi sayı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-neon-lime">Tokenlər</CardTitle>
              <CardDescription>Ümumi balans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-bold mb-2">-</div>
              <p className="text-sm text-neutral-secondary">Bütün istifadəçilərin balansı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-electric-cyan">İşlər</CardTitle>
              <CardDescription>Ümumi işlər</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-bold mb-2">-</div>
              <p className="text-sm text-neutral-secondary">Tamamlanmış işlər</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İstifadəçi İdarəetməsi</CardTitle>
              <CardDescription>
                İstifadəçiləri axtar, token əlavə et və ya hesabları idarə et
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-neutral-secondary">
                <p className="mb-4">İstifadəçi idarəetmə funksiyası tezliklə əlavə ediləcək</p>
                <p className="text-sm">
                  Hazırda Prisma Studio istifadə edə bilərsiniz: <code className="bg-onyx-light px-2 py-1 rounded">npx prisma studio</code>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preset İdarəetməsi</CardTitle>
              <CardDescription>
                Tuning və video effekt presetlərini idarə et
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-neutral-secondary">
                <p className="mb-4">Preset idarəetmə funksiyası tezliklə əlavə ediləcək</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marka/Model İdarəetməsi</CardTitle>
              <CardDescription>
                Dəstəklənən marka və modelləri əlavə et və ya redaktə et
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-neutral-secondary">
                <p className="mb-4">Marka/Model idarəetmə funksiyası tezliklə əlavə ediləcək</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
