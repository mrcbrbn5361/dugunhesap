import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { InsertTables, UpdateTables } from "@/types/supabase"

export async function getGifts(userId: string, eventId?: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    let query = supabase.from("gifts").select("*, events(title)").eq("user_id", userId)

    if (eventId) {
      query = query.eq("event_id", eventId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching gifts:", error)
    return { data: null, error }
  }
}

export async function getGift(id: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("gifts").select("*, events(title)").eq("id", id).single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching gift:", error)
    return { data: null, error }
  }
}

export async function createGift(gift: InsertTables<"gifts">) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("gifts").insert(gift).select().single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error creating gift:", error)
    return { data: null, error }
  }
}

export async function updateGift(id: string, gift: UpdateTables<"gifts">) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("gifts").update(gift).eq("id", id).select().single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error updating gift:", error)
    return { data: null, error }
  }
}

export async function deleteGift(id: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { error } = await supabase.from("gifts").delete().eq("id", id)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error("Error deleting gift:", error)
    return { error }
  }
}

export async function updateGiftCurrentValues(userId: string, goldPrices: any) {
  const supabase = getSupabaseBrowserClient()

  try {
    // Get all gold gifts for the user
    const { data: gifts, error: fetchError } = await supabase
      .from("gifts")
      .select("*")
      .eq("user_id", userId)
      .neq("gift_type", "cash")

    if (fetchError) throw fetchError

    if (!gifts || gifts.length === 0) {
      return { success: true }
    }

    // Update each gift's current value based on its type and quantity
    const updates = gifts.map((gift) => {
      let currentValue = 0

      switch (gift.gift_type) {
        case "gram":
          currentValue = goldPrices.gram * gift.quantity
          break
        case "quarter":
          currentValue = goldPrices.quarter * gift.quantity
          break
        case "half":
          currentValue = goldPrices.half * gift.quantity
          break
        case "full_gold":
          currentValue = goldPrices.full * gift.quantity
          break
        case "bracelet22k":
          currentValue = goldPrices.bracelet22k * gift.quantity
          break
        default:
          currentValue = gift.gift_value
      }

      return supabase.from("gifts").update({ current_value: currentValue }).eq("id", gift.id)
    })

    await Promise.all(updates)

    return { success: true }
  } catch (error) {
    console.error("Error updating gift values:", error)
    return { success: false, error }
  }
}
