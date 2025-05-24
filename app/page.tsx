import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GoldIcon } from "@/components/gold-icon"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-amber-500 to-yellow-500 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GoldIcon className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Düğün Hesap</h1>
            </div>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="outline" className="bg-white text-amber-600 hover:bg-amber-50">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-amber-600 hover:bg-amber-50">Kayıt Ol</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-amber-800 mb-6">Düğün Hediyelerinizin Değerini Hesaplayın</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
              Düğününüzde aldığınız altın ve para hediyelerinin güncel değerini kolayca hesaplayın. Gerçek zamanlı altın
              fiyatlarıyla tam ve doğru sonuçlar alın.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Hemen Başla
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Daha Fazla Bilgi
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-amber-800 mb-12">Özellikler</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-amber-50 p-6 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">Gerçek Zamanlı Altın Fiyatları</h3>
                <p className="text-gray-700">
                  Güncel altın fiyatlarıyla hesaplamalarınızı yapın. Gram, çeyrek, yarım ve tam altın değerlerini
                  otomatik olarak güncelliyoruz.
                </p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">Etkinlik Yönetimi</h3>
                <p className="text-gray-700">
                  Birden fazla etkinlik oluşturun ve yönetin. Düğün, nişan veya diğer özel günlerinizi ayrı ayrı takip
                  edin.
                </p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">Detaylı Raporlar</h3>
                <p className="text-gray-700">
                  Hediyelerinizin toplam değerini görün. Altın ve nakit olarak ayrı ayrı raporlar alın ve toplam değeri
                  hesaplayın.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-amber-800 mb-8">Hemen Başlayın</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Ücretsiz hesap oluşturun ve düğün hediyelerinizin değerini hemen hesaplamaya başlayın.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Ücretsiz Kayıt Ol
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GoldIcon className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">Düğün Hesap</span>
            </div>
            <div className="text-gray-400 text-sm">© {new Date().getFullYear()} Düğün Hesap. Tüm hakları saklıdır.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
