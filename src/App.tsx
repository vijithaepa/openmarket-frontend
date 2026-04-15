import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useWebSocket } from './hooks/useWebSocket'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { Navbar } from './components/common/Navbar'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { MyListingsPage } from './pages/MyListingsPage'
import { OffersPage } from './pages/OffersPage'
import { OfferDetailPage } from './pages/OfferDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

function AppLayout() {
  useWebSocket() // initialise WS connection while authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-8">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/my" element={<OffersPage />} />
          <Route path="/offers/:id" element={<OfferDetailPage />} />
          <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/my-listings/new" element={<MyListingsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '14px' },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </>
  )
}
