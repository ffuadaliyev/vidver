import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 md:py-12 mt-12 md:mt-20 mb-16 lg:mb-0">
      <div className="container px-4 md:px-6 lg:px-8">
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
  )
}
