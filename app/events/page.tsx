"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { EventSummaryCard } from "@/components/event-summary-card"
import { useAuth } from "@/contexts/auth-context"
import { getEvents } from "@/services/event-service"
import { getGifts } from "@/services/gift-service"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

interface EventWithGifts {
  id: string
  title: string
  date: string
  totalValue: number
  giftCount: number
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState<EventWithGifts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchEvents() {
      if (!user) return

      setIsLoading(true)
      try {
        const { data: eventsData, error: eventsError } = await getEvents(user.id)

        if (eventsError) {
          throw eventsError
        }

        if (!eventsData) {
          setEvents([])
          return
        }

        // Fetch gifts for each event to calculate totals
        const eventsWithGifts = await Promise.all(
          eventsData.map(async (event) => {
            const { data: giftsData } = await getGifts(user.id, event.id)

            const totalValue = giftsData
              ? giftsData.reduce((sum, gift) => sum + (gift.current_value || gift.gift_value), 0)
              : 0

            return {
              id: event.id,
              title: event.title,
              date: format(new Date(event.event_date), "d MMMM yyyy", { locale: tr }),
              totalValue,
              giftCount: giftsData?.length || 0,
            }
          }),
        )

        setEvents(eventsWithGifts)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Hata",
          description: "Etkinlikler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [user])

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Etkinliklerim</h1>
          <p className="text-muted-foreground">Tüm etkinliklerinizi görüntüleyin ve yönetin</p>
        </div>
        <Link href="/events/new">
          <Button className="bg-amber-600 hover:bg-amber-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Etkinlik
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Etkinlik ara..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
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
    </div>
  )
}
