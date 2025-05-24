import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Gift, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EventSummaryCardProps {
  id: string
  title: string
  date: string
  totalValue: number
  giftCount: number
  detailed?: boolean
}

export function EventSummaryCard({ id, title, date, totalValue, giftCount, detailed = false }: EventSummaryCardProps) {
  return (
    <Card className={detailed ? "overflow-hidden" : ""}>
      {detailed && <div className="h-2 bg-amber-500 w-full" />}
      <CardContent className={detailed ? "p-6" : "p-4"}>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold ${detailed ? "text-xl" : "text-base"}`}>{title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {date}
              </div>
            </div>
            {detailed && (
              <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">Aktif</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground text-xs flex items-center mb-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Toplam Değer
              </div>
              <div className={`font-bold ${detailed ? "text-xl" : "text-lg"}`}>
                ₺{totalValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs flex items-center mb-1">
                <Gift className="h-3.5 w-3.5 mr-1" />
                Hediye Sayısı
              </div>
              <div className={`font-bold ${detailed ? "text-xl" : "text-lg"}`}>{giftCount}</div>
            </div>
          </div>
        </div>
      </CardContent>
      {detailed && (
        <CardFooter className="bg-muted/20 px-6 py-3">
          <div className="flex gap-2 w-full">
            <Link href={`/events/${id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Detaylar
              </Button>
            </Link>
            <Link href={`/gifts?event=${id}`} className="flex-1">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Hediye Ekle</Button>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
