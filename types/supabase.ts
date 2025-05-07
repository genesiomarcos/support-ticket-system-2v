export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          ticket_id: string
          user_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          content: string
          ticket_id: string
          user_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          content?: string
          ticket_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      operations: {
        Row: {
          id: string
          description: string
          ticket_id: string
          user_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          description: string
          ticket_id: string
          user_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          description?: string
          ticket_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      priorities: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      statuses: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          subject: string
          description: string
          category_id: string
          status_id: string
          priority_id: string
          created_by: string
          completed_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          subject: string
          description: string
          category_id: string
          status_id: string
          priority_id: string
          created_by: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          subject?: string
          description?: string
          category_id?: string
          status_id?: string
          priority_id?: string
          created_by?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}
