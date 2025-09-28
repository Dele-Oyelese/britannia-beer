// components/beer / beer - form.tsx
import React, { useState } from 'react'
import { BeerWithSizes } from '../../lib/database.types'
import { beerService } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Input } from '../ui/input'

interface BeerFormProps {
  beer?: BeerWithSizes
  onSave: () => void
  onCancel: () => void
}

interface BeerFormData {
  name: string
  type: string
  abv: number
  description: string
  image_url: string
}

interface SizeFormData {
  size_name: string
  price: number
  stock_quantity: number
}

export const BeerForm: React.FC<BeerFormProps> = ({ beer, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [beerData, setBeerData] = useState<BeerFormData>({
    name: beer?.name || '',
    type: beer?.type || '',
    abv: beer?.abv || 0,
    description: beer?.description || '',
    image_url: beer?.image_url || ''
  })

  const [sizes, setSizes] = useState<(SizeFormData & { id?: string })[]>(
    beer?.sizes?.map(size => ({
      id: size.id,
      size_name: size.size_name,
      price: size.price,
      stock_quantity: size.stock_quantity
    })) || [{ size_name: '', price: 0, stock_quantity: 0 }]
  )

  const handleBeerDataChange = (field: keyof BeerFormData, value: any) => {
    setBeerData(prev => ({ ...prev, [field]: value }))
  }

  const handleSizeChange = (index: number, field: keyof SizeFormData, value: any) => {
    setSizes(prev => prev.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    ))
  }

  const addSize = () => {
    setSizes(prev => [...prev, { size_name: '', price: 0, stock_quantity: 0 }])
  }

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let beerId = beer?.id

      // Create or update beer
      if (beer) {
        const { error: updateError } = await beerService.updateBeer(beer.id, beerData)
        if (updateError) throw updateError
      } else {
        const { beer: newBeer, error: createError } = await beerService.createBeer(beerData)
        if (createError) throw createError
        beerId = newBeer?.id
      }

      if (!beerId) throw new Error('Failed to get beer ID')

      // Handle sizes
      for (const size of sizes) {
        if (size.size_name && size.price > 0) {
          if (size.id) {
            // Update existing size
            await beerService.updateBeerSize(size.id, {
              size_name: size.size_name,
              price: size.price,
              stock_quantity: size.stock_quantity
            })
          } else {
            // Create new size
            await beerService.addBeerSize({
              beer_id: beerId,
              size_name: size.size_name,
              price: size.price,
              stock_quantity: size.stock_quantity
            })
          }
        }
      }

      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save beer')
    } finally {
      setLoading(false)
    }
  }

  const commonBeerTypes = [
    'IPA', 'Pale Ale', 'Lager', 'Stout', 'Porter', 'Wheat Beer',
    'Pilsner', 'Sour', 'Amber Ale', 'Belgian Ale', 'Session Ale'
  ]

  const commonSizes = [
    '355ml Can', '473ml Can', '650ml Bottle', '750ml Bottle',
    '1L Growler', '2L Growler', 'Pint (568ml)', 'Half Pint (284ml)'
  ]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-britannia-navy">
          {beer ? 'Edit Beer' : 'Add New Beer'}
        </h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Beer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Beer Name"
              value={beerData.name}
              onChange={(e) => handleBeerDataChange('name', e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beer Type
              </label>
              <select
                value={beerData.type}
                onChange={(e) => handleBeerDataChange('type', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-britannia-navy"
                required
              >
                <option value="">Select Type</option>
                {commonBeerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <Input
              label="ABV (%)"
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={beerData.abv}
              onChange={(e) => handleBeerDataChange('abv', parseFloat(e.target.value))}
              required
            />

            <Input
              label="Image URL (optional)"
              value={beerData.image_url}
              onChange={(e) => handleBeerDataChange('image_url', e.target.value)}
              placeholder="https://glacier-design.com/wp-content/uploads/2022/10/Can-you-hydrate-yourself-with-beer-scaled.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={beerData.description}
              onChange={(e) => handleBeerDataChange('description', e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-britannia-navy"
              placeholder="Describe the beer's flavor profile, ingredients, and characteristics..."
            />
          </div>

          {/* Size Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-britannia-navy">Size Variants</h3>
              <Button type="button" onClick={addSize} variant="outline" size="sm">
                Add Size
              </Button>
            </div>

            <div className="space-y-4">
              {sizes.map((size, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <select
                      value={size.size_name}
                      onChange={(e) => handleSizeChange(index, 'size_name', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-britannia-navy"
                      required
                    >
                      <option value="">Select Size</option>
                      {commonSizes.map(sizeOption => (
                        <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value))}
                    required
                  />

                  <Input
                    label="Stock Quantity"
                    type="number"
                    min="0"
                    value={size.stock_quantity}
                    onChange={(e) => handleSizeChange(index, 'stock_quantity', parseInt(e.target.value))}
                    required
                  />

                  <div className="flex items-end">
                    {sizes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSize(index)}
                        variant="danger"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              {beer ? 'Update Beer' : 'Create Beer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
