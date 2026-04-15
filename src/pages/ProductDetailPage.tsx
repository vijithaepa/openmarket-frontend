import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Package, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi } from '../api/products'
import { offersApi } from '../api/offers'
import { Product } from '../types/product'
import { RootState } from '../store/store'
import { OfferForm } from '../components/offers/OfferForm'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '../utils/formatters'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useSelector((s: RootState) => s.auth)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    productsApi.getById(id)
      .then(setProduct)
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const handleOffer = async (data: { offeredPrice: number; quantity: number; message?: string }) => {
    if (!product) return
    setSubmitting(true)
    try {
      await offersApi.create(product.id, data)
      toast.success('Offer submitted!')
      setShowOfferForm(false)
    } catch {
      toast.error('Failed to submit offer')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!product) return <p className="text-center text-gray-400 py-12">Product not found.</p>

  const canMakeOffer = user?.role === 'BUYER' && product.status === 'ACTIVE'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover rounded-xl mb-4" />
      ) : (
        <div className="w-full h-40 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
          <Package size={48} className="text-primary-300" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary-700">{formatCurrency(product.askingPrice)}</p>
            <p className="text-xs text-gray-400">per {product.unit}</p>
          </div>
        </div>

        {product.category && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
            {product.category}
          </span>
        )}

        {product.description && (
          <p className="mt-3 text-sm text-gray-600">{product.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div><span className="text-gray-400">Available:</span> {product.quantity} {product.unit}</div>
          <div><span className="text-gray-400">Listed:</span> {formatDate(product.createdAt)}</div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <User size={14} /> {product.seller.fullName}
          </p>
          {product.seller.phone && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone size={14} /> {product.seller.phone}
            </p>
          )}
        </div>

        {canMakeOffer && !showOfferForm && (
          <button
            onClick={() => setShowOfferForm(true)}
            className="mt-5 w-full bg-primary-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700"
          >
            Make an Offer
          </button>
        )}

        {showOfferForm && (
          <div className="mt-5 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Your Offer</h3>
            <OfferForm
              productName={product.name}
              askingPrice={product.askingPrice}
              unit={product.unit}
              onSubmit={handleOffer}
              onCancel={() => setShowOfferForm(false)}
              loading={submitting}
            />
          </div>
        )}
      </div>
    </div>
  )
}
