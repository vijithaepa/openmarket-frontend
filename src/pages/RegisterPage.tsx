import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  role: z.enum(['SELLER', 'BUYER']),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'BUYER' },
  })

  const role = watch('role')

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Email may already be in use.')
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary-600 rounded-full p-3 mb-3">
            <Sprout size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(['BUYER', 'SELLER'] as const).map((r) => (
              <label
                key={r}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${
                  role === r
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <input type="radio" value={r} {...register('role')} className="sr-only" />
                {r === 'SELLER' ? '🌾 Seller' : '🛒 Buyer'}
              </label>
            ))}
          </div>

          {[
            { label: 'Full Name *', name: 'fullName' as const, type: 'text' },
            { label: 'Email *', name: 'email' as const, type: 'email' },
            { label: 'Password *', name: 'password' as const, type: 'password' },
            { label: 'Phone', name: 'phone' as const, type: 'tel' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                {...register(name)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
