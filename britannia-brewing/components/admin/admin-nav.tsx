// components/admin/admin-nav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { auth } from '@/lib/auth'
import { useAuth } from '@/utils/auth-helpers'
import { Button } from '@/components/ui/button'

export const AdminNav: React.FC = () => {
  const router = useRouter()
  const { profile } = useAuth()

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/inventory', label: 'Inventory', icon: '🍺' },
    ...(profile?.role === 'super_admin' ? [
      { href: '/admin/users', label: 'User Management', icon: '👥' }
    ] : [])
  ]

  return (
    <nav className="admin-sidebar w-64 flex flex-col">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-britannia-gold rounded-full flex items-center justify-center">
            <span className="text-britannia-navy font-bold text-sm">BB</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-britannia-cream">Britannia Brewing</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-britannia-gold text-britannia-navy font-medium'
                      : 'text-britannia-cream hover:bg-blue-800 hover:text-white'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="mb-4">
          <p className="text-sm text-britannia-cream">Signed in as:</p>
          <p className="text-sm font-medium text-white truncate">{profile?.email}</p>
          <p className="text-xs text-britannia-gold capitalize">{profile?.role?.replace('_', ' ')}</p>
        </div>

        <div className="space-y-2">
          <Link href="/" className="block w-full">
            <Button variant="ghost" size="sm" className="w-full text-left justify-start text-britannia-cream hover:text-white">
              View Public Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-left justify-start text-britannia-cream hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
