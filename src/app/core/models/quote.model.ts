import { ProductWithImages } from './product.model';

export type QuoteStatus = 'PENDIENTE' | 'EN_REVISION' | 'RESPONDIDA' | 'RECHAZADA';

export interface Client {
  clientId: string;
  name: string;
  phone: string;
  mail: string;
}

export interface QuoteItem {
  itemquoteId: string;
  quoteId: string;
  productId: string;
  quantity: number;
  requestDate: string;
  status: string;
  description: string;
  product: ProductWithImages;
}

export interface QuoteWithRelations {
  quoteId: string;
  clientId: string;
  requestDate: string;
  status: QuoteStatus;
  description: string;
  created_at: string;
  updated_at: string;
  client: Client;
  quoted_Items: QuoteItem[];
}

export interface CreateQuotePayload {
  client_name: string;
  client_email: string;
  client_phone: string;
  description?: string;
  items: { productId: string; quantity: number }[];
}
