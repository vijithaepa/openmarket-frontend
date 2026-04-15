import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Product, ProductRequest } from '../../types/product'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  askingPrice: z.coerce.number().positive('Price must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<Product>
  onSubmit: (data: ProductRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ProductForm({ defaultValues, onSubmit, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      description: defaultValues.description ?? '',
      category: defaultValues.category ?? '',
      askingPrice: defaultValues.askingPrice,
      unit: defaultValues.unit,
      quantity: defaultValues.quantity,
      imageUrl: defaultValues.imageUrl ?? '',
    } : undefined,
  })

  const field = (label: string, name: keyof FormData, type = 'text', placeholder?: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={type === 'number' ? 'any' : undefined}
        placeholder={placeholder}
        {...register(name)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as ProductRequest))} className="space-y-4">
      {field('Product Name *', 'name', 'text', 'e.g. Honeycrisp Apples')}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      {field('Category', 'category', 'text', 'e.g. Fruits, Vegetables')}
      <div className="grid grid-cols-2 gap-3">
        {field('Asking Price ($/unit) *', 'askingPrice', 'number', '0.00')}
        {field('Unit *', 'unit', 'text', 'kg, dozen, lb...')}
      </div>
      {field('Available Quantity *', 'quantity', 'number', '0')}
      {field('Image URL', 'imageUrl', 'url', 'https://')}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Listing'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
