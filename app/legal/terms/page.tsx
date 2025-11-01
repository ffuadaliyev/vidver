import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'İstifadə Şərtləri',
  description: 'vidver.ai platformasının istifadə şərtləri və qaydaları',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx via-onyx-light to-onyx">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-neon-lime to-electric-cyan bg-clip-text text-transparent">
            vidver.ai
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">Ana səhifə</Button>
          </Link>
        </div>
      </header>

      <div className="container py-12 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold mb-4">İstifadə Şərtləri</h1>
        <p className="text-neutral-secondary mb-8">Son yenilənmə: 31 Oktyabr 2025</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">1. Xidmətlərin Qəbulu</h2>
            <p className="text-neutral-secondary">
              vidver.ai platformasından istifadə etməklə, bu istifadə şərtlərini qəbul etmiş olursunuz.
              Şərtlərlə razı deyilsinizsə, zəhmət olmasa platformadan istifadə etməyin.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">2. Xidmətlərin Təsviri</h2>
            <p className="text-neutral-secondary">
              vidver.ai aşağıdakı AI əsaslı xidmətlər təqdim edir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Avtomobil şəkillərinin AI ilə tuninqi</li>
              <li>Şəkildən video generasiyası</li>
              <li>Tuning presetləri və şablonları</li>
              <li>Token əsaslı ödəniş sistemi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">3. İstifadəçi Hesabları</h2>
            <p className="text-neutral-secondary">Hesab yaratarkən:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Doğru və aktual məlumat təqdim etməlisiniz</li>
              <li>Hesab təhlükəsizliyindən siz məsulsunsuz</li>
              <li>Şifrənizi başqaları ilə paylaşmamalısınız</li>
              <li>18 yaşdan böyük olmalısınız</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">4. Token Sistemi</h2>
            <p className="text-neutral-secondary">Token istifadəsi:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Yeni istifadəçilər 100 pulsuz token alır</li>
              <li>Şəkil tuning: 20 token</li>
              <li>Video generasiya: 50 token</li>
              <li>Tokenlər qeri qaytarılmır</li>
              <li>Əlavə tokenlər satın alına bilər</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">5. Məzmun Qaydaları</h2>
            <p className="text-neutral-secondary">Yüklədiyiniz məzmun:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-secondary ml-4">
              <li>Qanuni olmalıdır</li>
              <li>Başqalarının müəllif hüquqlarını pozmamalıdır</li>
              <li>Zorakılıq, nifrət və ya uyğunsuz məzmun olmamalıdır</li>
              <li>Spam və ya zərərli proqramlar olmamalıdır</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">6. Müəllif Hüquqları</h2>
            <p className="text-neutral-secondary">
              Yüklədiyiniz şəkillər üzərində müəllif hüquqlarına sahib olmalısınız.
              AI tərəfindən yaradılan nəticələr sizə məxsusdur, lakin platformamız həmin məzmunu
              marketinq və təkmilləşdirmə məqsədləri üçün istifadə edə bilər.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">7. Xidmət Məhdudiyyətləri</h2>
            <p className="text-neutral-secondary">
              Platformadan sui-istifadə hallarında (spam, DDoS, hack cəhdləri və s.) hesabınız bloklanacaq.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">8. Məsuliyyətdən İmtina</h2>
            <p className="text-neutral-secondary">
              vidver.ai AI nəticələrinin dəqiqliyi və keyfiyyəti üçün zəmanət vermir.
              Xidmətlər &quot;olduğu kimi&quot; təqdim edilir. Platformanın istifadəsi nəticəsində
              yarana biləcək zərərlərə görə məsuliyyət daşımırıq.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">9. Xidmətin Dayandırılması</h2>
            <p className="text-neutral-secondary">
              Biz istənilən vaxt xəbərdarlıq etmədən xidməti dayandıra, dəyişdirə və ya
              yeniləyə bilərik. Texniki problemlər və ya profilaktik işlər zamanı xidmət
              müvəqqəti əlçatmaz ola bilər.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">10. Şərtlərdə Dəyişikliklər</h2>
            <p className="text-neutral-secondary">
              İstifadə şərtləri vaxtaşırı yenilənə bilər. Əhəmiyyətli dəyişikliklər haqqında
              sizə bildiriş göndərəcəyik. Dəyişikliklərdən sonra platformadan istifadə etməyə
              davam etsəniz, yeni şərtləri qəbul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-3">11. Əlaqə</h2>
            <p className="text-neutral-secondary">
              İstifadə şərtləri ilə bağlı suallarınız varsa:
            </p>
            <p className="text-neutral-secondary">
              E-poçt: <a href="mailto:support@vidver.ai" className="text-primary hover:underline">support@vidver.ai</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex gap-4">
            <Link href="/legal/privacy">
              <Button variant="outline">Məxfilik Siyasəti</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Əlaqə</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
