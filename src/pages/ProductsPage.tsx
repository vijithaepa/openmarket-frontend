import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { productsApi } from '../api/products'
import { Product } from '../types/product'
import { ProductCard } from '../components/products/ProductCard'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productsApi.list({
        category: category || undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page,
        size: 12,
      })
      setProducts(data.content)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    fetchProducts()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Marketplace</h2>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Category (e.g. Fruits)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700"
        >
          <Search size={15} /> Search
        </button>
      </form>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
