// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BeerGrid } from '@/components/beer/beer-grid'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { BeerWithSizes } from '@/lib/database.types'
import { beerService } from '@/lib/supabase'

export default function HomePage() {
  const [featuredBeers, setFeaturedBeers] = useState<BeerWithSizes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedBeers()
  }, [])

  const loadFeaturedBeers = async () => {
    try {
      const { beers } = await beerService.getBeersWithSizes()
      // Show first 4 beers as featured
      setFeaturedBeers(beers.slice(0, 4))
    } catch (error) {
      console.error('Error loading featured beers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Britannia Brewing - Craft Beer Inventory</title>
        <meta name="description" content="Discover our current selection of craft beers at Britannia Brewing. View our real-time inventory and available sizes." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <section className="britannia-gradient text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Craft Beer Inventory
            </h1>
            <p className="text-xl md:text-2xl text-britannia-cream mb-8 max-w-3xl mx-auto">
              Discover our current selection of handcrafted ales.
              Real-time inventory from our Ladner, Steveston, and Lake Country locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beers">
                <Button variant="secondary" size="lg">
                  View All Beers
                </Button>
              </Link>
              <a href="https://www.bbco.ca/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-britannia-navy">
                  Visit Main Website
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Featured Beers Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-britannia-navy mb-4">
                Featured Beers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A selection of our current favorites, crafted with passion and available now.
              </p>
            </div>

            <BeerGrid beers={featuredBeers} loading={loading} />

            {featuredBeers.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/beers">
                  <Button variant="primary" size="lg">
                    View Complete Inventory
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-britannia-navy text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-britannia-navy mb-2">Multiple Locations</h3>
                <p className="text-base text-gray-600">Visit our taprooms in Ladner, Steveston, and Lake Country</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-britannia-navy text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-britannia-navy mb-2">Real-Time Updates</h3>
                <p className="text-base text-gray-600">Live inventory tracking shows exactly what's available now</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-britannia-navy text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-britannia-navy mb-2">Quality Assured</h3>
                <p className="text-base text-gray-600">Every beer is crafted with the finest ingredients and attention to detail</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
