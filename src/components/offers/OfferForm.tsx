import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { OfferRequest } from '../../types/offer'

const schema = z.object({
  offeredPrice: z.coerce.number().positive('Price must be positive'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  productName: string
  askingPrice: number
  unit: string
  onSubmit: (data: OfferRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function OfferForm({ productName, askingPrice, unit, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { offeredPrice: askingPrice, quantity: 1 },
  })

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as OfferRequest))} className="space-y-4">
      <div className="bg-primary-50 rounded-lg p-3 text-sm">
        <p className="font-medium text-primary-800">{productName}</p>
        <p className="text-primary-600">Asking price: ${askingPrice}/{unit}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer Price *</label>
        <input
          type="number"
          step="any"
          {...register('offeredPrice')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        {errors.offeredPrice && <p className="text-red-500 text-xs mt-1">{errors.offeredPrice.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({unit}) *</label>
        <input
          type="number"
          step="any"
          {...register('quantity')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note to Open (optional)</label>
        <textarea
          {...register('message')}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Offer'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
