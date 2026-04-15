import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IMessage } from '@stomp/stompjs'
import toast from 'react-hot-toast'
import { offersApi } from '../api/offers'
import { Offer } from '../types/offer'
import { RootState } from '../store/store'
import { useWebSocket } from '../hooks/useWebSocket'
import { OfferStatusBadge } from '../components/offers/OfferStatusBadge'
import { ChatWindow } from '../components/chat/ChatWindow'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '../utils/formatters'

export function OfferDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useSelector((s: RootState) => s.auth)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [counterValue, setCounterValue] = useState('')
  const [showCounter, setShowCounter] = useState(false)
  const { subscribe, unsubscribe } = useWebSocket()

  const fetchOffer = useCallback(async () => {
    if (!id) return
    try {
      const data = await offersApi.getById(id)
      setOffer(data)
    } catch {
      toast.error('Failed to load offer')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOffer()
    if (!id) return
    const dest = `/topic/offers/${id}/status`
    subscribe(dest, (msg: IMessage) => {
      setOffer(JSON.parse(msg.body))
    })
    return () => unsubscribe(dest)
  }, [id, fetchOffer, subscribe, unsubscribe])

  const doAction = async (action: () => Promise<Offer>) => {
    setActionLoading(true)
    try {
      const updated = await action()
      setOffer(updated)
      toast.success('Done!')
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!offer) return <p className="text-center text-gray-400 py-12">Offer not found.</p>

  const isFarmer = user?.id === offer.product.id // resolved via role from auth
  const userIsSeller = user?.role === 'SELLER'
  const userIsBuyer = user?.role === 'BUYER'
  const isPending = offer.status === 'PENDING'
  const isCountered = offer.status === 'COUNTERED'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Offer summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-800">{offer.product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Offered by {offer.buyer.fullName}</p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Asking price</span>
            <p className="font-medium">{formatCurrency(offer.product.askingPrice)}/{offer.product.unit}</p>
          </div>
          <div>
            <span className="text-gray-400">Offered price</span>
            <p className="font-medium text-primary-700">{formatCurrency(offer.offeredPrice)}</p>
          </div>
          <div>
            <span className="text-gray-400">Quantity</span>
            <p className="font-medium">{offer.quantity} {offer.product.unit}</p>
          </div>
          {offer.counterPrice && (
            <div>
              <span className="text-gray-400">Counter price</span>
              <p className="font-medium text-blue-700">{formatCurrency(offer.counterPrice)}</p>
            </div>
          )}
        </div>

        {offer.message && (
          <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-gray-400 text-xs">Note: </span>
            {offer.message}
          </div>
        )}

        {/* Seller actions */}
        {userIsSeller && (isPending || isCountered) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => doAction(() => offersApi.accept(offer.id))}
              disabled={actionLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => doAction(() => offersApi.reject(offer.id))}
              disabled={actionLoading}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
            {isPending && (
              <button
                onClick={() => setShowCounter(!showCounter)}
                className="flex-1 border border-blue-300 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
              >
                Counter
              </button>
            )}
          </div>
        )}

        {showCounter && (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Counter price"
              value={counterValue}
              onChange={(e) => setCounterValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button
              onClick={() => {
                const val = parseFloat(counterValue)
                if (!val || val <= 0) return toast.error('Enter a valid price')
                doAction(() => offersApi.counter(offer.id, val))
                setShowCounter(false)
                setCounterValue('')
              }}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}

        {/* Buyer: withdraw */}
        {userIsBuyer && (isPending || isCountered) && (
          <button
            onClick={() => doAction(() => offersApi.withdraw(offer.id))}
            disabled={actionLoading}
            className="mt-4 w-full border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
          >
            Withdraw Offer
          </button>
        )}
      </div>

      {/* Chat */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">Negotiation Chat</h3>
        <div style={{ height: '360px' }} className="flex flex-col">
          <ChatWindow offerId={offer.id} />
        </div>
      </div>
    </div>
  )
}
