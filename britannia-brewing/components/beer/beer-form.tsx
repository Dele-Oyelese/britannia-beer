import Head from 'next/head'
import { useEffect, useState } from 'react'
import { AdminNav } from '@/components/admin/admin-nav'
import { ProtectedRoute } from '@/components/admin/protected-route'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BeerWithSizes } from '@/lib/database.types'
import { beerService } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBeers: 0,
    totalSizes: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  })
  const [recentBeers, setRecentBeers] = useState<BeerWithSizes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { beers } = await beerService.getBeersWithSizes()

      const totalSizes = beers.reduce((acc, beer) => acc + beer.sizes.length, 0)
      const lowStockItems = beers.reduce((acc, beer) =>
        acc + beer.sizes.filter(size => size.stock_quantity > 0 && size.stock_quantity <= 5).length, 0
      )
      const outOfStockItems = beers.reduce((acc, beer) =>
        acc + beer.sizes.filter(size => size.stock_quantity === 0).length, 0
      )

      setStats({
        totalBeers: beers.length,
        totalSizes,
        lowStockItems,
        outOfStockItems
      })

      setRecentBeers(beers.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Dashboard - Britannia Brewing</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-britannia-navy">Dashboard</h1>
              <p className="text-gray-600">Overview of your brewery inventory</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-britannia-navy text-white rounded-lg flex items-center justify-center mr-4">
                      🍺
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-britannia-navy">
                        {loading ? '...' : stats.totalBeers}
                      </p>
                      <p className="text-sm text-gray-600">Total Beers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4">
                      📦
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-britannia-navy">
                        {loading ? '...' : stats.totalSizes}
                      </p>
                      <p className="text-sm text-gray-600">Size Variants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-600 text-white rounded-lg flex items-center justify-center mr-4">
                      ⚠️
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {loading ? '...' : stats.lowStockItems}
                      </p>
                      <p className="text-sm text-gray-600">Low Stock (≤5)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center mr-4">
                      🚫
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {loading ? '...' : stats.outOfStockItems}
                      </p>
                      <p className="text-sm text-gray-600">Out of Stock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Beers */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-britannia-navy">Recent Beers</h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentBeers.length > 0 ? (
                  <div className="space-y-4">
                    {recentBeers.map((beer) => (
                      <div key={beer.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {beer.image_url ? (
                            <img src={beer.image_url} alt={beer.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-gray-400 text-2xl">🍺</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-britannia-navy">{beer.name}</h3>
                          <p className="text-sm text-gray-600">{beer.type} • {beer.abv}% ABV</p>
                          <p className="text-sm text-gray-500">{beer.sizes.length} size variants</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {beer.sizes.reduce((acc, size) => acc + size.stock_quantity, 0)} total stock
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No beers available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
