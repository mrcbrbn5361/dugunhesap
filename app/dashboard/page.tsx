"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, TrendingUp, Gift, DollarSign, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { GoldPriceCard } from "@/components/gold-price-card"
import { EventSummaryCard } from "@/components/event-summary-card"
import { RecentGiftsTable } from "@/components/recent-gifts-table"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { fetchGoldPrices, saveGoldPrices } from "@/services/gold-price-service"
import { getEvents } from "@/services/event-service"
import { getGifts, updateGiftCurrentValues } from "@/services/gift-service"

interface GoldPrices {
  gram: number
  quarter: number
  half: number
  full: number
  bracelet22k: number
  lastUpdated: string
  isError?: boolean
}

export default function DashboardPage() {
  const [goldPrices, setGoldPrices] = useState<GoldPrices>({
    gram: 2450.75,
    quarter: 4050.5,
    half: 8100.25,
    full: 16200.5,
    bracelet22k: 21000.0,
    lastUpdated: new Date().toISOString(),
  })

  const [priceChanges, setPriceChanges] = useState({
    gram: 12.5,
    quarter: 20.75,
    half: 42.3,
    full: 85.25,
    bracelet22k: 110.5,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [totalValues, setTotalValues] = useState({
    total: 0,
    gold: 0,
    cash: 0,
  })
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchGoldPricesData() {
      try {
        setIsLoading(true)
        const data = await fetchGoldPrices()

        setGoldPrices(data)
        setIsError(!!data.isError)

        // In a real app, we would calculate the changes by comparing with previous prices
        // For now, we'll use random values for demonstration
        setPriceChanges({
          gram: Number.parseFloat((Math.random() * 20 - 5).toFixed(2)),
          quarter: Number.parseFloat((Math.random() * 30 - 8).toFixed(2)),
          half: Number.parseFloat((Math.random() * 50 - 10).toFixed(2)),
          full: Number.parseFloat((Math.random() * 100 - 20).toFixed(2)),
          bracelet22k: Number.parseFloat((Math.random() * 150 - 30).toFixed(2)),
        })

        if (data.isError) {
          toast({
            title: "Uyarı",
            description: "Gerçek zamanlı altın fiyatları alınamadı. Tahmini değerler gösteriliyor.",
            variant: "destructive",
          })
        } else {
          // Save gold prices to database
          await saveGoldPrices(data)
        }

        // Update gift values with new prices
        if (user) {
          await updateGiftCurrentValues(user.id, data)
        }
      } catch (error) {
        console.error("Error fetching gold prices:", error)
        setIsError(true)
        toast({
          title: "Hata",
          description: "Altın fiyatları alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchUserData() {
      if (!user) return

      try {
        setIsLoadingEvents(true)

        // Fetch events
        const { data: eventsData } = await getEvents(user.id)

        if (eventsData) {
          const eventsWithGifts = await Promise.all(
            eventsData.slice(0, 2).map(async (event) => {
              const { data: giftsData } = await getGifts(user.id, event.id)

              const totalValue = giftsData
                ? giftsData.reduce((sum, gift) => sum + (gift.current_value || gift.gift_value), 0)
                : 0

              return {
                id: event.id,
                title: event.title,
                date: new Date(event.event_date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                totalValue,
                giftCount: giftsData?.length || 0,
              }
            }),
          )

          setEvents(eventsWithGifts)
        }

        // Fetch all gifts to calculate totals
        const { data: allGifts } = await getGifts(user.id)

        if (allGifts) {
          const total = allGifts.reduce((sum, gift) => sum + (gift.current_value || gift.gift_value), 0)
          const goldTotal = allGifts
            .filter((gift) => gift.gift_type !== "cash")
            .reduce((sum, gift) => sum + (gift.current_value || gift.gift_value), 0)
          const cashTotal = allGifts
            .filter((gift) => gift.gift_type === "cash")
            .reduce((sum, gift) => sum + gift.gift_value, 0)

          setTotalValues({
            total,
            gold: goldTotal,
            cash: cashTotal,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoadingEvents(false)
      }
    }

    fetchGoldPricesData()
    fetchUserData()

    // Set up a polling interval to refresh prices
    const intervalId = setInterval(fetchGoldPricesData, 3600000) // Refresh every hour

    return () => clearInterval(intervalId)
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
          <p className="text-muted-foreground">Düğün hediyelerinizi takip etmek için kontrol paneliniz</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/events/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Etkinlik
            </Button>
          </Link>
          <Link href="/gifts">
            <Button variant="outline">
              <Gift className="mr-2 h-4 w-4" />
              Hediye Ekle
            </Button>
          </Link>
        </div>
      </div>

      {isError && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Dikkat</AlertTitle>
          <AlertDescription>
            Gerçek zamanlı altın fiyatları alınamadı. Gösterilen değerler tahmini olabilir.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GoldPriceCard
          title="Gram Altın"
          value={goldPrices.gram}
          change={priceChanges.gram}
          isLoading={isLoading}
          isError={isError}
        />
        <GoldPriceCard
          title="Çeyrek Altın"
          value={goldPrices.quarter}
          change={priceChanges.quarter}
          isLoading={isLoading}
          isError={isError}
        />
        <GoldPriceCard
          title="Yarım Altın"
          value={goldPrices.half}
          change={priceChanges.half}
          isLoading={isLoading}
          isError={isError}
        />
        <GoldPriceCard
          title="Tam Altın"
          value={goldPrices.full}
          change={priceChanges.full}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Son güncelleme: {new Date(goldPrices.lastUpdated).toLocaleString("tr-TR")}</div>
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
          Fiyatları Güncelle
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="events">Etkinlikler</TabsTrigger>
          <TabsTrigger value="gifts">Son Hediyeler</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="h-8 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₺
                      {totalValues.total.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">Tüm etkinliklerden toplam değer</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Altın</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="h-8 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₺
                      {totalValues.gold.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">Altın hediyelerin toplam değeri</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Nakit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="h-8 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ₺
                      {totalValues.cash.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">Nakit hediyelerin toplam değeri</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Son Etkinlikler</CardTitle>
                <CardDescription>En son eklediğiniz etkinlikler</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <EventSummaryCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        date={event.date}
                        totalValue={event.totalValue}
                        giftCount={event.giftCount}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Henüz etkinlik eklenmemiş</div>
                )}
                <div className="mt-4 text-center">
                  <Link href="/events">
                    <Button variant="outline" size="sm">
                      Tüm Etkinlikleri Görüntüle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hızlı İstatistikler</CardTitle>
                <CardDescription>Hediyelerinizin dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Altın</span>
                        <span className="font-medium">
                          {totalValues.total > 0
                            ? `${Math.round((totalValues.gold / totalValues.total) * 100)}%`
                            : "0%"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{
                            width:
                              totalValues.total > 0
                                ? `${Math.round((totalValues.gold / totalValues.total) * 100)}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Nakit</span>
                        <span className="font-medium">
                          {totalValues.total > 0
                            ? `${Math.round((totalValues.cash / totalValues.total) * 100)}%`
                            : "0%"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width:
                              totalValues.total > 0
                                ? `${Math.round((totalValues.cash / totalValues.total) * 100)}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {isLoadingEvents ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventSummaryCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  totalValue={event.totalValue}
                  giftCount={event.giftCount}
                  detailed
                />
              ))}
              <Card className="flex flex-col items-center justify-center p-6 h-full">
                <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Yeni Etkinlik Ekle</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Yeni bir düğün, nişan veya özel gün ekleyin
                </p>
                <Link href="/events/new">
                  <Button className="bg-amber-600 hover:bg-amber-700">Etkinlik Ekle</Button>
                </Link>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gifts" className="space-y-4">
          <RecentGiftsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
