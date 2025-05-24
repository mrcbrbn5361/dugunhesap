import { getSupabaseBrowserClient } from "@/lib/supabase"

export interface GoldPrices {
  gram: number
  quarter: number
  half: number
  full: number
  bracelet22k: number
  lastUpdated: string
  isError?: boolean
}

export async function fetchGoldPrices(): Promise<GoldPrices> {
  try {
    const response = await fetch("/api/gold-prices")

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching gold prices:", error)
    throw error
  }
}

export async function saveGoldPrices(prices: GoldPrices) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { error } = await supabase.from("gold_price_history").insert({
      gram_gold: prices.gram,
      quarter_gold: prices.quarter,
      half_gold: prices.half,
      full_gold: prices.full,
      bracelet22k: prices.bracelet22k,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error saving gold prices:", error)
    return { success: false, error }
  }
}

export async function getLatestGoldPrices() {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase
      .from("gold_price_history")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    if (data) {
      return {
        gram: data.gram_gold,
        quarter: data.quarter_gold,
        half: data.half_gold,
        full: data.full_gold,
        bracelet22k: data.bracelet22k,
        lastUpdated: data.recorded_at,
      }
    }

    return null
  } catch (error) {
    console.error("Error getting latest gold prices:", error)
    return null
  }
}
