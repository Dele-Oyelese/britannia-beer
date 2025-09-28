// components/layout/footer.tsx
import Link from 'next/link'
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-britannia-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Britannia Brewing</h3>
            <p className="text-britannia-cream mb-4">
              Crafting exceptional ales with passion and tradition.
              Visit our taprooms in Ladner, Steveston, and Lake Country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-britannia-gold hover:text-yellow-400">Facebook</a>
              <a href="#" className="text-britannia-gold hover:text-yellow-400">Instagram</a>
              <a href="#" className="text-britannia-gold hover:text-yellow-400">Twitter</a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-britannia-cream hover:text-white">Home</Link></li>
              <li><Link href="/beers" className="text-britannia-cream hover:text-white">Our Beers</Link></li>
              <li><a href="https://www.bbco.ca/" className="text-britannia-cream hover:text-white">Main Website</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-britannia-cream text-sm">
              For inventory inquiries:<br />
              info@bbco.ca
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-britannia-cream text-sm">
            © {new Date().getFullYear()} Britannia Brewing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
