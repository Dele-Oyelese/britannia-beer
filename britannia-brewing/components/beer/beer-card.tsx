// components/beer / beer - card.tsx
import React from 'react'
import { BeerWithSizes } from '@/lib/database.types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface BeerCardProps {
  beer: BeerWithSizes
}

export const BeerCard: React.FC<BeerCardProps> = ({ beer }) => {
  const availableSizes = beer.sizes.filter(size => size.stock_quantity > 0)
  const isInStock = availableSizes.length > 0

  return (
    <Card className="beer-card h-full">
      <CardHeader className="pb-4">
        <div className="aspect-square w-full bg-gray-100 rounded-lg mb-4 overflow-hidden">
          {beer.image_url ? (
            <img
              src={beer.image_url}
              alt={beer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-britannia-navy mb-1">{beer.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{beer.type} • {beer.abv}% ABV</p>
          {!isInStock && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {beer.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{beer.description}</p>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-800">Available Sizes:</h4>
          {beer.sizes.length > 0 ? (
            <div className="space-y-1">
              {beer.sizes.map((size) => (
                <div key={size.id} className="flex justify-between items-center text-sm">
                  <span className={size.stock_quantity === 0 ? 'text-gray-400' : 'text-gray-700'}>
                    {size.size_name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${size.stock_quantity === 0 ? 'text-gray-400' : 'text-britannia-navy'}`}>
                      ${size.price.toFixed(2)}
                    </span>
                    {size.stock_quantity === 0 ? (
                      <span className="text-xs text-red-600">Out of Stock</span>
                    ) : (
                      <span className="text-xs text-green-600">
                        {size.stock_quantity} available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sizes available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
