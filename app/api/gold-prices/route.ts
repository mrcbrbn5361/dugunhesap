import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    // Fetch gold prices from a real API
    const response = await fetch("https://api.collectapi.com/economy/goldPrice", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `apikey ${process.env.COLLECTAPI_KEY || "demo-key"}`,
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Map the API response to our application's format
    const goldPrices = {
      gram: Number.parseFloat(data.result.find((item: any) => item.name === "Gram Altın")?.buying || 2450.75),
      quarter: Number.parseFloat(data.result.find((item: any) => item.name === "Çeyrek Altın")?.buying || 4050.5),
      half: Number.parseFloat(data.result.find((item: any) => item.name === "Yarım Altın")?.buying || 8100.25),
      full: Number.parseFloat(data.result.find((item: any) => item.name === "Tam Altın")?.buying || 16200.5),
      bracelet22k: Number.parseFloat(
        data.result.find((item: any) => item.name === "22 Ayar Bilezik")?.buying || 21000.0,
      ),
      lastUpdated: new Date().toISOString(),
    }

    // Save the prices to the database
    const supabase = getSupabaseServerClient()
    await supabase.from("gold_price_history").insert({
      gram_gold: goldPrices.gram,
      quarter_gold: goldPrices.quarter,
      half_gold: goldPrices.half,
      full_gold: goldPrices.full,
      bracelet22k: goldPrices.bracelet22k,
    })

    return NextResponse.json(goldPrices)
  } catch (error) {
    console.error("Error fetching gold prices:", error)

    // Try to get the latest prices from the database
    try {
      const supabase = getSupabaseServerClient()
      const { data } = await supabase
        .from("gold_price_history")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .single()

      if (data) {
        const dbPrices = {
          gram: data.gram_gold,
          quarter: data.quarter_gold,
          half: data.half_gold,
          full: data.full_gold,
          bracelet22k: data.bracelet22k,
          lastUpdated: data.recorded_at,
          isError: true,
        }
        return NextResponse.json(dbPrices)
      }
    } catch (dbError) {
      console.error("Error fetching from database:", dbError)
    }

    // Fallback to mock data if both API call and database fetch fail
    const fallbackPrices = {
      gram: 2450.75,
      quarter: 4050.5,
      half: 8100.25,
      full: 16200.5,
      bracelet22k: 21000.0,
      lastUpdated: new Date().toISOString(),
      isError: true,
    }

    return NextResponse.json(fallbackPrices)
  }
}
