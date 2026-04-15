import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi } from '../api/products'
import { Product, ProductRequest } from '../types/product'
import { ProductCard } from '../components/products/ProductCard'
import { ProductForm } from '../components/products/ProductForm'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchListings = async () => {
    setLoading(true)
    try {
      const data = await productsApi.myListings()
      setProducts(data.content)
    } catch {
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  const handleCreate = async (data: ProductRequest) => {
    setSubmitting(true)
    try {
      await productsApi.create(data)
      toast.success('Listing created!')
      setShowForm(false)
      fetchListings()
    } catch {
      toast.error('Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdraw = async (id: string) => {
    if (!confirm('Withdraw this listing?')) return
    try {
      await productsApi.withdraw(id)
      toast.success('Listing withdrawn')
      fetchListings()
    } catch {
      toast.error('Failed to withdraw listing')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Listings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <PlusCircle size={16} /> New Listing
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">New Product Listing</h3>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={submitting}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No listings yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              showActions
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      )}
    </div>
  )
}
