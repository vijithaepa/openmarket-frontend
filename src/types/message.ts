export interface SenderSummary {
  id: string
  fullName: string
}

export interface ChatMessage {
  id: string
  offerId: string
  sender: SenderSummary
  content: string
  sentAt: string
  readAt?: string
}

export interface Notification {
  type: 'OFFER_RECEIVED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED' | 'OFFER_COUNTERED' | 'NEW_MESSAGE'
  offerId: string
  productName: string
  actorName: string
  timestamp: string
}
