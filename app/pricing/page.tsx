import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Qiymətlər',
  description: 'vidver.ai token paketləri və qiymətləndirmə',
}

export default function PricingPage() {
  const packages = [
    {
      name: 'Starter',
      tokens: 100,
      price: 'Pulsuz',
      description: 'Yeni istifadəçilər üçün',
      features: [
        '100 pulsuz token',
        '5 şəkil tuning',
        '2 video generasiya',
        'Bütün presetlərə giriş',
        'Tarixçə saxlanılır',
      ],
      cta: 'Qeydiyyat',
      highlighted: false,
    },
    {
      name: 'Basic',
      tokens: 500,
      price: '₼29',
      description: 'Fərdi istifadəçilər üçün',
      features: [
        '500 token',
        '25 şəkil tuning',
        '10 video generasiya',
        'Premium presetlər',
        'Prioritet dəstək',
        'HD nəticələr',
      ],
      cta: 'Satın al',
      highlighted: false,
    },
    {
      name: 'Pro',
      tokens: 1000,
      price: '₼49',
      description: 'Profesional istifadəçilər',
      features: [
        '1000 token',
        '50 şəkil tuning',
        '20 video generasiya',
        'Bütün premium presetlər',
        'VIP dəstək',
        '4K nəticələr',
        'API girişi',
      ],
      cta: 'Satın al',
      highlighted: true,
    },
    {
      name: 'Business',
      tokens: 5000,
      price: '₼199',
      description: 'Biznes və agentliklər',
      features: [
        '5000 token',
        '250 şəkil tuning',
        '100 video generasiya',
        'Custom presetlər',
        'Xüsusi dəstək',
        '4K və RAW',
        'Tam API girişi',
        'White-label opsiyası',
      ],
      cta: 'Satın al',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <Button variant="outline" size="sm">Giriş</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Qeydiyyat</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-5xl font-bold mb-4">
            Sizin üçün mükəmməl plan
          </h1>
          <p className="text-xl text-neutral-secondary max-w-2xl mx-auto">
            Token paketini seçin və avtomobilinizi yeni görkəmə gətirin.
            Bütün paketlər lifetime keçərlidir.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative ${
                pkg.highlighted
                  ? 'border-2 border-primary shadow-2xl shadow-primary/20 scale-105'
                  : 'border-border'
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Ən Populyar
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-heading text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-heading font-bold">
                    {pkg.price}
                  </div>
                  <div className="text-sm text-neutral-secondary mt-1">
                    {pkg.tokens} token
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-neutral-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/sign-up">
                  <Button
                    className="w-full"
                    variant={pkg.highlighted ? 'default' : 'outline'}
                  >
                    {pkg.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">
            Qiymətlər haqqında suallar
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tokenlərin müddəti var?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-secondary">
                  Xeyr, satın aldığınız tokenlər lifetime keçərlidir və müddətsizdir.
                  İstədiyiniz vaxt istifadə edə bilərsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geri qaytarma var?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-secondary">
                  Texniki problemlər halında 7 gün ərzində tam geri qaytarma təmin edirik.
                  İstifadə edilmiş tokenlər geri qaytarılmır.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Əlavə token ala bilərəm?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-secondary">
                  Bəli, istənilən vaxt əlavə token paketləri satın ala bilərsiniz.
                  Tokenlər avtomatik balansınıza əlavə olunur.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Korporativ endirimlər?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-secondary">
                  100+ istifadəçisi olan şirkətlər üçün xüsusi qiymətlər təqdim edirik.
                  Ətraflı məlumat üçün bizimlə əlaqə saxlayın.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Hələ də qərar verə bilmirsiniz?
          </h2>
          <p className="text-neutral-secondary mb-6">
            Pulsuz 100 token ilə başlayın və fərqi görün
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Pulsuz başla</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Əlaqə saxla</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
