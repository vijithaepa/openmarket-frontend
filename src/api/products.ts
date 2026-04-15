import client from './client'
import { Product, ProductPage, ProductRequest } from '../types/product'

export const productsApi = {
  list: (params?: { category?: string; minPrice?: number; maxPrice?: number; page?: number; size?: number }) =>
    client.get<ProductPage>('/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    client.get<Product>(`/products/${id}`).then((r) => r.data),

  myListings: (params?: { page?: number; size?: number }) =>
    client.get<ProductPage>('/products/my', { params }).then((r) => r.data),

  create: (data: ProductRequest) =>
    client.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: ProductRequest) =>
    client.put<Product>(`/products/${id}`, data).then((r) => r.data),

  withdraw: (id: string) =>
    client.delete(`/products/${id}`),
}
