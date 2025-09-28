// lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      beers: {
        Row: {
          id: string
          name: string
          type: string
          abv: number
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          abv: number
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          abv?: number
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      beer_sizes: {
        Row: {
          id: string
          beer_id: string
          size_name: string
          price: number
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          beer_id: string
          size_name: string
          price: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          beer_id?: string
          size_name?: string
          price?: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface BeerWithSizes {
  id: string
  name: string
  type: string
  abv: number
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  sizes: BeerSize[]
}

export interface BeerSize {
  id: string
  beer_id: string
  size_name: string
  price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}
