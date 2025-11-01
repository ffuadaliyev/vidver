import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-neutral-text via-neon-lime to-electric-cyan bg-clip-text text-transparent">
            Avtomobilinizi saniyələr içində yeni görkəmə gətirin
          </h1>
          <p className="text-xl text-neutral-secondary mb-8 max-w-2xl mx-auto">
            Şəkildən modifikasiya və effektli videolar – AI ilə, vidver.ai-də.
            Kreativ presetlər, realistik nəticələr, asan paylaşım.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <>
                <Link href="/image">
                  <Button size="lg" className="text-lg px-8 h-14">
                    Şəkil Tuning
                  </Button>
                </Link>
                <Link href="/video">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                    Video Generator
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button size="lg" className="text-lg px-8 h-14">
                    Başla (pulsuz 100 token)
                  </Button>
                </Link>
                <Link href="/image">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                    Demo-ya bax
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 border-t border-border/40">
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
      <section className="container py-20 border-t border-border/40">
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
      <section className="container py-20 border-t border-border/40">
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

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">vidver.ai</h3>
              <p className="text-sm text-neutral-secondary">
                AI ilə avtomobil tuninqi platforması
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Məhsul</h4>
              <ul className="space-y-2 text-sm text-neutral-secondary">
                <li><Link href="/image" className="hover:text-primary">Şəkil Tuning</Link></li>
                <li><Link href="/video" className="hover:text-primary">Video Generator</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Qiymətlər</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirkət</h4>
              <ul className="space-y-2 text-sm text-neutral-secondary">
                <li><Link href="/legal/privacy" className="hover:text-primary">Məxfilik</Link></li>
                <li><Link href="/legal/terms" className="hover:text-primary">Şərtlər</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Əlaqə</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Yardım</h4>
              <ul className="space-y-2 text-sm text-neutral-secondary">
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary">Tarixçə</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-neutral-secondary">
            © 2025 vidver.ai. Bütün hüquqlar qorunur.
          </div>
        </div>
      </footer>
    </div>
  );
}
