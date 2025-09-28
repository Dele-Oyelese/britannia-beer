// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
// Database operations for beers

export const beerService = {
  // Get all active beers with sizes
  async getBeersWithSizes() {
    const { data: beers, error: beersError } = await supabase
      .from('beers')
      .select(`
        *,
        sizes:beer_sizes(*)
      `)
      .eq('is_active', true)
      .order('name')

    if (beersError) return { beers: [], error: beersError }

    // Filter active sizes and sort by price
    if (!beers) {
      return { beers: [], error: null }
    }

    const beersWithActiveSizes = beers.map(beer => ({
      ...beer,
      sizes: beer.sizes
        .filter((size: any) => size.is_active)
        .sort((a: any, b: any) => a.price - b.price)
    }))

    return { beers: beersWithActiveSizes, error: null }
  },

  // Get single beer with sizes
  async getBeerWithSizes(beerId: string) {
    const { data, error } = await supabase
      .from('beers')
      .select(`
        *,
        sizes:beer_sizes(*)
      `)
      .eq('id', beerId)
      .single()

    if (error || !data) return { beer: null, error }

    const beerWithActiveSizes = {
      ...data,
      sizes: data.sizes
        .filter((size: any) => size.is_active)
        .sort((a: any, b: any) => a.price - b.price)
    }

    return { beer: beerWithActiveSizes, error: null }
  },

  // Create new beer
  async createBeer(beer: Database['public']['Tables']['beers']['Insert']) {
    const { data, error } = await supabase
      .from('beers')
      .insert([beer])
      .select()
      .single()

    return { beer: data, error }
  },

  // Update beer
  async updateBeer(beerId: string, updates: Database['public']['Tables']['beers']['Update']) {
    const { data, error } = await supabase
      .from('beers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', beerId)
      .select()
      .single()

    return { beer: data, error }
  },

  // Delete beer (soft delete)
  async deleteBeer(beerId: string) {
    const { data, error } = await supabase
      .from('beers')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', beerId)
      .select()
      .single()

    return { beer: data, error }
  },

  // Add size to beer
  async addBeerSize(size: Database['public']['Tables']['beer_sizes']['Insert']) {
    const { data, error } = await supabase
      .from('beer_sizes')
      .insert([size])
      .select()
      .single()

    return { size: data, error }
  },

  // Update beer size
  async updateBeerSize(sizeId: string, updates: Database['public']['Tables']['beer_sizes']['Update']) {
    const { data, error } = await supabase
      .from('beer_sizes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sizeId)
      .select()
      .single()

    return { size: data, error }
  },

  // Update stock quantity
  async updateStock(sizeId: string, quantity: number) {
    const { data, error } = await supabase
      .from('beer_sizes')
      .update({
        stock_quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', sizeId)
      .select()
      .single()

    return { size: data, error }
  },

  // Delete beer size (soft delete)
  async deleteBeerSize(sizeId: string) {
    const { data, error } = await supabase
      .from('beer_sizes')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', sizeId)
      .select()
      .single()

    return { size: data, error }
  }
}
