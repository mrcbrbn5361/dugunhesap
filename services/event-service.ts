import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { InsertTables, UpdateTables } from "@/types/supabase"

export async function getEvents(userId: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching events:", error)
    return { data: null, error }
  }
}

export async function getEvent(id: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching event:", error)
    return { data: null, error }
  }
}

export async function createEvent(event: InsertTables<"events">) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("events").insert(event).select().single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error creating event:", error)
    return { data: null, error }
  }
}

export async function updateEvent(id: string, event: UpdateTables<"events">) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("events").update(event).eq("id", id).select().single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error updating event:", error)
    return { data: null, error }
  }
}

export async function deleteEvent(id: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { error }
  }
}
