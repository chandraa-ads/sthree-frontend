import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string | null
          email_verified: boolean
          full_name: string | null
          phone: string | null
          address: string | null
          profile_photo: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          phone?: string | null
          address?: string | null
          profile_photo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          phone?: string | null
          address?: string | null
          profile_photo?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          stock: number
          category: string
          color: string | null
          size: string | null
          brand: string | null
          rating: number | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          stock: number
          category: string
          color?: string | null
          size?: string | null
          brand?: string | null
          rating?: number | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          stock?: number
          category?: string
          color?: string | null
          size?: string | null
          brand?: string | null
          rating?: number | null
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}