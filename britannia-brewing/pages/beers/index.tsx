// pages/beers/index.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { BeerGrid } from '../../components/beer/beer-grid'
import { Footer } from '../../components/layout/footer'
import { Header } from '../../components/layout/header'
import { Input } from '../../components/ui/input'
import { BeerWithSizes } from '../../lib/database.types'
import { beerService } from '../../lib/supabase'

export default function BeersPage() {
  const [beers, setBeers] = useState<BeerWithSizes[]>([])
  const [filteredBeers, setFilteredBeers] = useState<BeerWithSizes[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    loadBeers()
  }, [])

  useEffect(() => {
    filterBeers()
  }, [beers, searchTerm, selectedType])

  const loadBeers = async () => {
    try {
      const { beers } = await beerService.getBeersWithSizes()
      setBeers(beers)
    } catch (error) {
      console.error('Error loading beers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBeers = () => {
    let filtered = beers

    if (searchTerm) {
      filtered = filtered.filter(beer =>
        beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType) {
      filtered = filtered.filter(beer => beer.type === selectedType)
    }

    setFilteredBeers(filtered)
  }

  const beerTypes = [...new Set(beers.map(beer => beer.type))].sort()

  return (
    <>
      <Head>
        <title>Our Beers - Britannia Brewing</title>
        <meta name="description" content="Browse our complete selection of craft beers with real-time inventory and pricing information." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Page Header */}
        <section className="britannia-gradient text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Beer Selection
            </h1>
            <p className="text-xl text-britannia-cream max-w-2xl mx-auto">
              Explore our complete inventory of handcrafted ales with real-time availability
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white shadow-sm py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search beers by name, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-britannia-navy"
                >
                  <option value="">All Types</option>
                  {beerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <div className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${filteredBeers.length} beer${filteredBeers.length !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beer Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BeerGrid beers={filteredBeers} loading={loading} />
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
