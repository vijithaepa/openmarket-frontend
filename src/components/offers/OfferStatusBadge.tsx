import { OfferStatus } from '../../types/offer'

const styles: Record<OfferStatus, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  ACCEPTED:  'bg-green-100  text-green-800',
  REJECTED:  'bg-red-100    text-red-800',
  COUNTERED: 'bg-blue-100   text-blue-800',
  WITHDRAWN: 'bg-gray-100   text-gray-600',
  EXPIRED:   'bg-gray-100   text-gray-500',
}

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
