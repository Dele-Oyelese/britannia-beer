import { auth } from '@/lib/auth'
import { useAuth } from '@/utils/auth-helpers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const Header: React.FC = () => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  return (
    <header className="britannia-gradient shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/britannia-logo.png"
                alt="Britannia Brewing"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">Britannia Brewing</h1>
                <p className="text-sm text-britannia-cream">Craft Ales</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-britannia-gold transition-colors">
              Home
            </Link>
            <Link href="/beers" className="text-white hover:text-britannia-gold transition-colors">
              Our Beers
            </Link>
            {profile?.role && (
              <Link href="/admin/dashboard" className="text-white hover:text-britannia-gold transition-colors">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">
                  {profile?.email}
                </span>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button variant="secondary" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
