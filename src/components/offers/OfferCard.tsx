import { Link } from 'react-router-dom'
import { Offer } from '../../types/offer'
import { OfferStatusBadge } from './OfferStatusBadge'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{offer.product.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">by {offer.seller.fullName}</p>
        </div>
        <OfferStatusBadge status={offer.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>
          <span className="text-gray-400">Asking:</span>{' '}
          <span className="font-medium">{formatCurrency(offer.product.askingPrice)}/{offer.product.unit}</span>
        </div>
        <div>
          <span className="text-gray-400">Offered:</span>{' '}
          <span className="font-medium text-primary-700">{formatCurrency(offer.offeredPrice)}</span>
        </div>
        {offer.counterPrice && (
          <div className="col-span-2">
            <span className="text-gray-400">Counter:</span>{' '}
            <span className="font-medium text-blue-700">{formatCurrency(offer.counterPrice)}</span>
          </div>
        )}
        <div className="col-span-2 text-gray-400">{formatDate(offer.createdAt)}</div>
      </div>

      <Link
        to={`/offers/${offer.id}`}
        className="mt-3 block text-center py-1.5 rounded-lg text-sm bg-primary-50 text-primary-700 hover:bg-primary-100"
      >
        View Details
      </Link>
    </div>
  )
}
