'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Register user
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Qeydiyyat xətası')
        setLoading(false)
        return
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Qeydiyyat uğurlu oldu, amma giriş xətası')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Qeydiyyat xətası baş verdi')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link href="/" className="flex justify-center mb-4">
            <span className="font-heading text-3xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
              vidver.ai
            </span>
          </Link>
          <CardTitle className="text-2xl text-center">Qeydiyyat</CardTitle>
          <CardDescription className="text-center">
            Yeni hesab yaradın və 100 pulsuz token qazanın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs text-neutral-secondary">Minimum 6 simvol</p>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 cursor-pointer accent-neon-lime"
              />
              <label htmlFor="terms" className="text-sm text-neutral-secondary cursor-pointer leading-relaxed">
                <Link href="/legal/terms" className="text-primary hover:underline" target="_blank">
                  İstifadə şərtlərini
                </Link>
                {' və '}
                <Link href="/legal/privacy" className="text-primary hover:underline" target="_blank">
                  məxfilik siyasətini
                </Link>
                {' qəbul edirəm'}
              </label>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !acceptedTerms}>
              {loading ? 'Qeydiyyat edilir...' : 'Qeydiyyatdan keç'}
            </Button>
          </form>

          {/* OAuth Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-neutral-secondary">və ya</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ilə qeydiyyat
            </Button>

            {/* Apple Sign-in (uncomment when credentials are ready) */}
            {/* <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple ilə qeydiyyat
            </Button> */}
          </div>

          <div className="text-center text-sm text-neutral-secondary mt-6">
            Artıq hesabınız var?{' '}
            <Link href="/auth/sign-in" className="text-primary hover:underline">
              Daxil ol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
