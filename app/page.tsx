import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeroCarousel } from "@/components/HeroCarousel";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
              vidver.ai
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/image" className="text-sm font-medium transition-colors hover:text-primary">
              Şəkil
            </Link>
            <Link href="/video" className="text-sm font-medium transition-colors hover:text-primary">
              Video
            </Link>
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Tarixçə
            </Link>
            {session ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-in">
                  <Button variant="outline" size="sm">Giriş</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">Qeydiyyat</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-neutral-text via-neon-lime to-electric-cyan bg-clip-text text-transparent">
              Avtomobilinizi saniyələr içində yeni görkəmə gətirin
            </h1>
            <p className="text-xl text-neutral-secondary mb-8 max-w-2xl mx-auto">
              Şəkildən modifikasiya və effektli videolar – AI ilə, vidver.ai-də.
              Kreativ presetlər, realistik nəticələr, asan paylaşım.
            </p>
          </div>

          {/* Carousel */}
          <HeroCarousel />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <>
                <Link href="/image" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-16 font-bold animate-pulse-glow hover:scale-105 transition-transform">
                    <span className="mr-2">🚗</span>
                    Şəkil Tuning
                  </Button>
                </Link>
                <Link href="/video" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-16 font-bold border-2 hover:bg-electric-cyan/10 hover:scale-105 transition-all">
                    <span className="mr-2">🎬</span>
                    Video Generator
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-16 font-bold animate-pulse-glow hover:scale-105 transition-transform">
                    <span className="mr-2">🎁</span>
                    Başla (pulsuz 100 token)
                  </Button>
                </Link>
                <Link href="/image" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 h-16 font-bold border-2 hover:bg-neon-lime/10 hover:scale-105 transition-all">
                    <span className="mr-2">👀</span>
                    Demo-ya bax
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 border-t border-border/40">
        <h2 className="font-heading text-4xl font-bold text-center mb-12">
          Niyə <span className="text-neon-lime">vidver.ai</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-electric-cyan">⚡ Sürətli</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI ilə saniyələr ərzində avtomobilinizə profes sional tuning tətbiq edin.
                Gözləməyə ehtiyac yoxdur.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-neon-lime">🎨 Kreativ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Minlərlə tuning opsiyası: body kit, disklər, rəng, spoyler və çox daha çox.
                Yaradıcılığınızı azad edin.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="text-electric-cyan">✨ Realistik</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Son model AI texnologiyası ilə foto-realistik nəticələr.
                Sanki real tuning olunubmuş kimi.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 border-t border-border/40">
        <h2 className="font-heading text-4xl font-bold text-center mb-12">
          Necə işləyir?
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-lime/20 flex items-center justify-center font-heading text-xl font-bold text-neon-lime">
              1
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-2">Şəkil yükləyin</h3>
              <p className="text-neutral-secondary">
                Avtomobilinizin 4 tərəfdən şəkillərini yükləyin (ön, arxa, sağ, sol).
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-electric-cyan/20 flex items-center justify-center font-heading text-xl font-bold text-electric-cyan">
              2
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-2">Tuning seçin</h3>
              <p className="text-neutral-secondary">
                Marka, model və istədiyiniz tuning elementlərini seçin. Template qalereya-da hazır stillərdən istifadə edin.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-lime/20 flex items-center justify-center font-heading text-xl font-bold text-neon-lime">
              3
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-2">AI işləsin</h3>
              <p className="text-neutral-secondary">
                Yalnız 5 saniyə gözləyin, AI avtomobilinizə seçdiyiniz tuninqi tətbiq etsin.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-electric-cyan/20 flex items-center justify-center font-heading text-xl font-bold text-electric-cyan">
              4
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-2">Saxlayın və paylaşın</h3>
              <p className="text-neutral-secondary">
                Nəticənizi yüksək keyfiyyətdə endirin və sosial şəbəkələrdə paylaşın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">
            {session ? "Gəlin yaradıcılığa başlayaq!" : "Hazırsınız? İndi başlayın!"}
          </h2>
          <p className="text-xl text-neutral-secondary mb-8">
            {session
              ? "Avtomobilinizin şəklini yükləyin və AI ilə professional tuning tətbiq edin."
              : "Qeydiyyatdan keçin və pulsuz 100 token qazanın. Kredit kartı tələb olunmur."
            }
          </p>
          {session ? (
            <Link href="/image">
              <Button size="lg" className="text-lg px-12 h-14 glow-lime">
                İndi tuning et
              </Button>
            </Link>
          ) : (
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-12 h-14 glow-lime">
                Pulsuz başla
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
