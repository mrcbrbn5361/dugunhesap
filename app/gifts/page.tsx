"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { RecentGiftsTable } from "@/components/recent-gifts-table"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { fetchGoldPrices } from "@/services/gold-price-service"
import { getEvents } from "@/services/event-service"
import { createGift } from "@/services/gift-service"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GoldType {
  id: string
  name: string
  value: number
}

export default function GiftsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventParam = searchParams.get("event")
  const { user } = useAuth()

  const [giftType, setGiftType] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [fromPerson, setFromPerson] = useState("")
  const [event, setEvent] = useState(eventParam || "")
  const [cashAmount, setCashAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [goldTypes, setGoldTypes] = useState<GoldType[]>([
    { id: "quarter", name: "Çeyrek Altın", value: 4050.5 },
    { id: "half", name: "Yarım Altın", value: 8100.25 },
    { id: "full_gold", name: "Tam Altın", value: 16200.5 },
    { id: "gram", name: "Gram Altın", value: 2450.75 },
    { id: "bracelet22k", name: "Bilezik (22K)", value: 21000.0 },
  ])
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [events, setEvents] = useState<{ id: string; name: string }[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGoldPricesData() {
      try {
        setIsLoadingPrices(true)
        const data = await fetchGoldPrices()

        // Update gold types with real prices
        setGoldTypes([
          { id: "quarter", name: "Çeyrek Altın", value: data.quarter },
          { id: "half", name: "Yarım Altın", value: data.half },
          { id: "full_gold", name: "Tam Altın", value: data.full },
          { id: "gram", name: "Gram Altın", value: data.gram },
          { id: "bracelet22k", name: "Bilezik (22K)", value: data.bracelet22k },
        ])

        if (data.isError) {
          toast({
            title: "Uyarı",
            description: "Gerçek zamanlı altın fiyatları alınamadı. Tahmini değerler gösteriliyor.",
            variant: "warning",
          })
        }
      } catch (error) {
        console.error("Error fetching gold prices:", error)
        toast({
          title: "Hata",
          description: "Altın fiyatları alınırken bir hata oluştu. Tahmini değerler kullanılıyor.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPrices(false)
      }
    }

    async function fetchEventsData() {
      if (!user) return

      try {
        setIsLoadingEvents(true)
        const { data, error } = await getEvents(user.id)

        if (error) {
          throw error
        }

        if (data) {
          const formattedEvents = data.map((event) => ({
            id: event.id,
            name: event.title,
          }))

          setEvents(formattedEvents)

          // If event param exists, set the event
          if (eventParam) {
            const foundEvent = data.find((e) => e.id === eventParam)
            if (foundEvent) {
              setEvent(foundEvent.id)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Hata",
          description: "Etkinlikler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingEvents(false)
      }
    }

    fetchGoldPricesData()
    fetchEventsData()
  }, [user, eventParam])

  const handleGoldSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const selectedGoldType = goldTypes.find((type) => type.id === giftType)

      if (!selectedGoldType) {
        throw new Error("Altın türü seçilmedi")
      }

      const giftValue = selectedGoldType.value * Number.parseInt(quantity)

      const { data, error } = await createGift({
        user_id: user.id,
        event_id: event,
        gift_type: giftType,
        quantity: Number.parseInt(quantity),
        from_person: fromPerson,
        gift_value: giftValue,
        current_value: giftValue,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Altın hediye başarıyla eklendi!",
      })

      // Reset form
      setGiftType("")
      setQuantity("1")
      setFromPerson("")
    } catch (err) {
      console.error("Error adding gold gift:", err)
      setError("Hediye eklenirken bir hata oluştu.")
      toast({
        title: "Hata",
        description: "Hediye eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const cashValue = Number.parseFloat(cashAmount)

      const { data, error } = await createGift({
        user_id: user.id,
        event_id: event,
        gift_type: "cash",
        quantity: 1,
        from_person: fromPerson,
        gift_value: cashValue,
        current_value: cashValue,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Nakit hediye başarıyla eklendi!",
      })

      // Reset form
      setCashAmount("")
      setFromPerson("")
    } catch (err) {
      console.error("Error adding cash gift:", err)
      setError("Hediye eklenirken bir hata oluştu.")
      toast({
        title: "Hata",
        description: "Hediye eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hediyeler</h1>
        <p className="text-muted-foreground">Hediyelerinizi ekleyin ve yönetin</p>
      </div>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Hediye Ekle</TabsTrigger>
          <TabsTrigger value="list">Tüm Hediyeler</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Altın Hediye Ekle</CardTitle>
                <CardDescription>Çeyrek, yarım, tam altın veya bilezik gibi altın hediyeleri ekleyin</CardDescription>
              </CardHeader>
              <form onSubmit={handleGoldSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goldType">Altın Türü</Label>
                    <Select value={giftType} onValueChange={setGiftType} required disabled={isLoadingPrices}>
                      <SelectTrigger id="goldType">
                        <SelectValue placeholder={isLoadingPrices ? "Fiyatlar yükleniyor..." : "Altın türü seçin"} />
                      </SelectTrigger>
                      <SelectContent>
                        {goldTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} (₺{type.value.toLocaleString("tr-TR")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Adet</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromPerson">Kimden</Label>
                    <Input
                      id="fromPerson"
                      placeholder="Hediyeyi veren kişi"
                      value={fromPerson}
                      onChange={(e) => setFromPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event">Etkinlik</Label>
                    <Select value={event} onValueChange={setEvent} required disabled={isLoadingEvents}>
                      <SelectTrigger id="event">
                        <SelectValue placeholder={isLoadingEvents ? "Etkinlikler yükleniyor..." : "Etkinlik seçin"} />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((evt) => (
                          <SelectItem key={evt.id} value={evt.id}>
                            {evt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading || isLoadingPrices || !giftType || !event}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ekleniyor...
                      </>
                    ) : (
                      "Altın Hediye Ekle"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nakit Hediye Ekle</CardTitle>
                <CardDescription>Nakit para hediyelerini ekleyin</CardDescription>
              </CardHeader>
              <form onSubmit={handleCashSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashAmount">Miktar (TL)</Label>
                    <Input
                      id="cashAmount"
                      type="number"
                      min="1"
                      placeholder="Nakit miktarı"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashFromPerson">Kimden</Label>
                    <Input
                      id="cashFromPerson"
                      placeholder="Hediyeyi veren kişi"
                      value={fromPerson}
                      onChange={(e) => setFromPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashEvent">Etkinlik</Label>
                    <Select value={event} onValueChange={setEvent} required disabled={isLoadingEvents}>
                      <SelectTrigger id="cashEvent">
                        <SelectValue placeholder={isLoadingEvents ? "Etkinlikler yükleniyor..." : "Etkinlik seçin"} />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((evt) => (
                          <SelectItem key={evt.id} value={evt.id}>
                            {evt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading || !cashAmount || !event}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ekleniyor...
                      </>
                    ) : (
                      "Nakit Hediye Ekle"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <RecentGiftsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
