export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          event_date: string
          location: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          event_date: string
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          event_date?: string
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          event_id: string
          user_id: string
          gift_type: string
          quantity: number
          from_person: string | null
          gift_value: number
          current_value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          gift_type: string
          quantity?: number
          from_person?: string | null
          gift_value: number
          current_value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          gift_type?: string
          quantity?: number
          from_person?: string | null
          gift_value?: number
          current_value?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      gold_price_history: {
        Row: {
          id: string
          gram_gold: number
          quarter_gold: number
          half_gold: number
          full_gold: number
          bracelet22k: number
          recorded_at: string
        }
        Insert: {
          id?: string
          gram_gold: number
          quarter_gold: number
          half_gold: number
          full_gold: number
          bracelet22k: number
          recorded_at?: string
        }
        Update: {
          id?: string
          gram_gold?: number
          quarter_gold?: number
          half_gold?: number
          full_gold?: number
          bracelet22k?: number
          recorded_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type InsertTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type UpdateTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
