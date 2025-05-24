"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getGifts } from "@/services/gift-service"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Gift {
  id: string
  gift_type: string
  quantity: number
  from_person: string | null
  gift_value: number
  current_value: number | null
  events: { title: string } | null
}

export function RecentGiftsTable() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchGifts() {
      if (!user) return

      try {
        setIsLoading(true)
        const { data, error } = await getGifts(user.id)

        if (error) {
          throw error
        }

        if (data) {
          setGifts(data)
        }
      } catch (error) {
        console.error("Error fetching gifts:", error)
        toast({
          title: "Hata",
          description: "Hediyeler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGifts()
  }, [user])

  const getGiftTypeName = (type: string) => {
    switch (type) {
      case "gram":
        return "Gram Altın"
      case "quarter":
        return "Çeyrek Altın"
      case "half":
        return "Yarım Altın"
      case "full_gold":
        return "Tam Altın"
      case "bracelet22k":
        return "Bilezik (22K)"
      case "cash":
        return "Nakit"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hediye Türü</TableHead>
              <TableHead>Adet</TableHead>
              <TableHead>Kimden</TableHead>
              <TableHead>Etkinlik</TableHead>
              <TableHead className="text-right">Değer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Henüz hediye eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              gifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell className="font-medium">{getGiftTypeName(gift.gift_type)}</TableCell>
                  <TableCell>{gift.quantity}</TableCell>
                  <TableCell>{gift.from_person || "-"}</TableCell>
                  <TableCell>{gift.events?.title || "-"}</TableCell>
                  <TableCell className="text-right">
                    ₺
                    {(gift.current_value || gift.gift_value).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Link href="/gifts">
          <Button variant="outline">Tüm Hediyeleri Görüntüle</Button>
        </Link>
      </div>
    </div>
  )
}
