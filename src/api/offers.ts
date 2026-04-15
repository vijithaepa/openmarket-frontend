import client from './client'
import { Offer, OfferPage, OfferRequest } from '../types/offer'

export const offersApi = {
  // Seller: incoming offers
  list: (params?: { page?: number; size?: number }) =>
    client.get<OfferPage>('/offers', { params }).then((r) => r.data),

  // Seller: my offers
  myOffers: (params?: { page?: number; size?: number }) =>
    client.get<OfferPage>('/offers/my', { params }).then((r) => r.data),

  getById: (id: string) =>
    client.get<Offer>(`/offers/${id}`).then((r) => r.data),

  create: (productId: string, data: OfferRequest) =>
    client.post<Offer>(`/products/${productId}/offers`, data).then((r) => r.data),

  accept: (id: string) =>
    client.patch<Offer>(`/offers/${id}/accept`).then((r) => r.data),

  reject: (id: string) =>
    client.patch<Offer>(`/offers/${id}/reject`).then((r) => r.data),

  counter: (id: string, counterPrice: number) =>
    client.patch<Offer>(`/offers/${id}/counter`, { counterPrice }).then((r) => r.data),

  withdraw: (id: string) =>
    client.patch<Offer>(`/offers/${id}/withdraw`).then((r) => r.data),
}
