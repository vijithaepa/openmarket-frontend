import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { offersApi } from '../api/offers'
import { Offer } from '../types/offer'
import { RootState } from '../store/store'
import { OfferCard } from '../components/offers/OfferCard'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export function OffersPage() {
  const { user } = useSelector((s: RootState) => s.auth)
  const isSeller = user?.role === 'SELLER'
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = isSeller ? offersApi.list() : offersApi.myOffers()
    fetch
      .then((data) => setOffers(data.content))
      .catch(() => toast.error('Failed to load offers'))
      .finally(() => setLoading(false))
  }, [isSeller])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isSeller ? 'Offers on My Products' : 'My Offers'}
      </h2>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : offers.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No offers yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map((o) => <OfferCard key={o.id} offer={o} />)}
        </div>
      )}
    </div>
  )
}
