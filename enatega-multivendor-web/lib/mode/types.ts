export interface ModeProduct {
  id: string;
  title: string;
  description?: string;
  image?: string;
  categoryId?: string;
  isOutOfStock?: boolean;
  variations: Array<{
    id: string;
    title?: string;
    name?: string;
    price: number;
    discountedPrice?: number;
    isOutOfStock?: boolean;
    deal?: {
      id?: string;
      discountType?: string | null;
      discountValue?: number | string | null;
      isActive?: boolean | null;
    } | null;
  }>;
}

export interface ModeCart {
  id?: string;
  itemCount: number;
  subtotal: number;
  total: number;
  discount: number;
  currencySymbol?: string;
}

export interface ModeOrder {
  id: string;
  displayId: string;
  status: string;
  amount: number;
  createdAt?: string;
  isPickedUp?: boolean;
}

export interface ModeOrderTracking {
  orderId: string;
  status: string;
  riderLocation?: { latitude: number; longitude: number };
  eta?: {
    phase?: string;
    estimatedArrivalAt?: string;
    encodedPolyline?: string;
  };
}

export interface ModeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
}
