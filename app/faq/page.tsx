import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata = {
  title: 'Tez-tez verilən suallar (FAQ)',
  description: 'vidver.ai platforması haqqında tez-tez verilən suallar və cavablar',
}

export default function FAQPage() {
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
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-bold mb-4">Tez-tez verilən suallar</h1>
          <p className="text-neutral-secondary text-lg">
            vidver.ai platforması haqqında ən çox soruşulan suallar
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              vidver.ai nədir və necə işləyir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              vidver.ai AI əsaslı avtomobil tuning platformasıdır. Avtomobilinizin şəkillərini yükləyir,
              istədiyiniz tuning elementlərini (body kit, disklər, rəng və s.) seçirsiniz və AI saniyələr
              ərzində foto-realistik nəticə yaradır. Həmçinin şəkildən effektli videolar da yarada bilərsiniz.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Token nədir və necə işləyir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Token platformamızda xidmətlərdən istifadə üçün istifadə olunan virtual valyutadır.
              Yeni qeydiyyatdan keçən hər istifadəçi 100 pulsuz token alır. Şəkil tuning 20 token,
              video generasiya isə 50 token dəyərindədir. Tokenlər bitdikdə əlavə satın ala bilərsiniz.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Hansı fayl formatları dəstəklənir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Şəkillər üçün: JPG, PNG, WebP formatları qəbul edilir. Maksimum fayl həcmi 10MB-dır.
              Ən yaxşı nəticə üçün yüksək keyfiyyətli, yaxşı işıqlandırılmış şəkillər tövsiyə edirik.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Hansı avtomobil markaları dəstəklənir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Platformamız 8+ məşhur markaya dəstək verir: BMW, Mercedes-Benz, Audi, Toyota, Hyundai,
              Kia, Volkswagen, Porsche və digərləri. Hər marka üçün 6-10 populyar model mövcuddur.
              Siyahı daim genişlənir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Nəticələri necə saxlayıram?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              AI tərəfindən yaradılan bütün şəkil və videolar avtomatik olaraq tarixçənizdə saxlanılır.
              Dashboard səhifəsindən istədiyiniz nəticəni yüksək keyfiyyətdə yükləyə bilərsiniz.
              Fayllar sizə məxsusdur və istədiyiniz yerdə paylaşa bilərsiniz.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              AI nə qədər müddətdə nəticə verir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Orta hesabla şəkil tuning 5-10 saniyə, video generasiya isə 10-15 saniyə çəkir.
              Prosesin sürəti serverin yükündən asılı olaraq dəyişə bilər. Nəticə hazır olduqda
              avtomatik bildiriş alacaqsınız.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Şəxsi məlumatlarım təhlükəsizdir?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Bəli, məlumat təhlükəsizliyi prioritetimizdir. Bütün məlumatlar şifrələnir,
              yüklənmiş şəkillər yalnız AI emalı üçün istifadə edilir və üçüncü tərəflərlə paylaşılmır.
              Detallı məlumat üçün <Link href="/legal/privacy" className="text-primary hover:underline">Məxfilik Siyasəti</Link> səhifəsinə baxın.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Ödəniş metodları hansılardır?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Hazırda kredit kartı, debet kartı və digər onlayn ödəniş metodlarını qəbul edirik.
              Token paketləri 100, 500, 1000 və 5000 token olaraq mövcuddur. Daha çox token alsanız,
              vahid qiymət daha ucuzdur.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Xidmət hansı dillərdə mövcuddur?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Platformamız hazırda Azərbaycan dilində mövcuddur. Tezliklə ingilis və rus dilləri də əlavə ediləcək.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10" className="border border-border rounded-lg px-6 bg-card">
            <AccordionTrigger className="font-semibold">
              Təklif və ya problem haqqında necə bildirə bilərəm?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-secondary">
              Bizə <Link href="/contact" className="text-primary hover:underline">Əlaqə</Link> səhifəsindən və ya
              support@vidver.ai e-poçt ünvanından yazaraq müraciət edə bilərsiniz.
              Təklifləriniz və geri bildirişləriniz bizim üçün çox dəyərlidir!
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-neutral-secondary mb-4">
            Sualınıza cavab tapa bilmədiniz?
          </p>
          <Link href="/contact">
            <Button size="lg">Bizimlə əlaqə saxlayın</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
