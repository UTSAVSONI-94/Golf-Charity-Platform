export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; name: string | null; created_at: string }
        Insert: { id: string; email: string; name?: string | null; created_at?: string }
        Update: { email?: string; name?: string | null }
      }
      scores: {
        Row: { id: string; user_id: string; score: number; date: string; created_at: string }
        Insert: { user_id: string; score: number; date: string }
        Update: { score?: number; date?: string }
      }
      subscriptions: {
        Row: { id: string; user_id: string; plan_type: string; status: string; start_date: string | null; end_date: string | null; stripe_subscription_id: string | null; created_at: string }
        Insert: { user_id: string; plan_type: string; status: string; stripe_subscription_id?: string | null }
        Update: { status?: string; end_date?: string | null }
      }
      draws: {
        Row: { id: string; month: number; year: number; draw_numbers: number[]; type: string; status: string; created_at: string }
        Insert: { month: number; year: number; draw_numbers: number[]; type: string; status: string }
      }
      charities: {
        Row: { id: string; name: string; description: string | null; image_url: string | null; featured: boolean; created_at: string }
      }
    }
  }
}
