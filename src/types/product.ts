export interface SellerSummary {
  id: string
  fullName: string
  phone?: string
}

export type ProductStatus = 'ACTIVE' | 'SOLD' | 'WITHDRAWN'

export interface Product {
  id: string
  seller: SellerSummary
  name: string
  description?: string
  category?: string
  askingPrice: number
  unit: string
  quantity: number
  imageUrl?: string
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface ProductPage {
  content: Product[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ProductRequest {
  name: string
  description?: string
  category?: string
  askingPrice: number
  unit: string
  quantity: number
  imageUrl?: string
}
