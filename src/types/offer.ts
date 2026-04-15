export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'WITHDRAWN' | 'EXPIRED'

export interface ProductSummary {
  id: string
  name: string
  askingPrice: number
  unit: string
}

export interface BuyerSummary {
  id: string
  fullName: string
}

export interface Offer {
  id: string
  product: ProductSummary
  buyer: BuyerSummary
  offeredPrice: number
  quantity: number
  status: OfferStatus
  counterPrice?: number
  message?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface OfferPage {
  content: Offer[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface OfferRequest {
  offeredPrice: number
  quantity: number
  message?: string
}
