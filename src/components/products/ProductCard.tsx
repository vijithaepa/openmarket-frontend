import { Link } from 'react-router-dom'
import { Package, Tag, User } from 'lucide-react'
import { Product } from '../../types/product'
import { formatCurrency } from '../../utils/formatters'

interface Props {
  product: Product
  showActions?: boolean
  onWithdraw?: (id: string) => void
}

export function ProductCard({ product, showActions, onWithdraw }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-primary-50 flex items-center justify-center">
          <Package size={40} className="text-primary-300" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-base leading-tight">{product.name}</h3>
          <span className="shrink-0 text-primary-700 font-bold text-sm">
            {formatCurrency(product.askingPrice)}/{product.unit}
          </span>
        </div>

        {product.category && (
          <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Tag size={11} /> {product.category}
          </span>
        )}

        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User size={11} /> {product.seller.fullName}
          </span>
          <span>Qty: {product.quantity} {product.unit}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center py-1.5 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700"
          >
            View
          </Link>
          {showActions && onWithdraw && (
            <button
              onClick={() => onWithdraw(product.id)}
              className="px-3 py-1.5 rounded-lg text-sm border border-red-200 text-red-600 hover:bg-red-50"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
