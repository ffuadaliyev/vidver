'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email və ya şifrə yanlışdır')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Giriş xətası baş verdi')
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
          <CardTitle className="text-2xl text-center">Giriş</CardTitle>
          <CardDescription className="text-center">
            Hesabınıza daxil olun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş edilir...' : 'Daxil ol'}
            </Button>

            <div className="text-center text-sm text-neutral-secondary">
              Hesabınız yoxdur?{' '}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Qeydiyyat
              </Link>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-neutral-secondary">
                Demo hesab: demo@vidver.ai / demo123
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
