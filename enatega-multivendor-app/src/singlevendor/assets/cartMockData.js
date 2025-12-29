/**
 * Mock data for testing cart functionality
 */

export const mockCartItems = [
  {
    key: 'cart-item-1',
    id: 'product-1',
    title: 'Apple Juice',
    description: 'Golden Delicious Apples, Filter Water, Ascorbic Acid',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop',
    price: 2.50,
    variationId: 'var-1',
    variationTitle: '1L',
    addons: ['Extra Ice', 'No Sugar'],
    quantity: 2
  },
  {
    key: 'cart-item-2',
    id: 'product-2',
    title: 'Orange Juice',
    description: 'Fresh squeezed oranges',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop',
    price: 1.50,
    variationId: 'var-2',
    variationTitle: '500ml',
    addons: [],
    quantity: 1
  },
  {
    key: 'cart-item-3',
    id: 'product-3',
    title: 'Mango Juice',
    description: 'Fresh mangoes',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop',
    price: 1.00,
    variationId: 'var-3',
    variationTitle: '500ml',
    addons: [],
    quantity: 4
  }
];

export const mockRecommendedProducts = [
  {
    id: 'rec-1',
    title: 'Veggie Spring Rolls',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=300&fit=crop',
    price: 9.50,
    volume: '180 g',
    pricePerLiter: 5.3,
    hasDeal: true,
    dealText: '25% Off',
    variations: [
      {
        id: 'var-rec-1',
        title: 'Regular',
        price: 9.50
      }
    ]
  },
  {
    id: 'rec-2',
    title: 'Falafel Bites',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop',
    price: 12.00,
    volume: '250 g',
    pricePerLiter: 4.8,
    hasDeal: true,
    dealText: '10% Off',
    variations: [
      {
        id: 'var-rec-2',
        title: 'Regular',
        price: 12.00
      }
    ]
  },
  {
    id: 'rec-3',
    title: 'Dried Mango',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop',
    price: 12.00,
    volume: '250 g',
    pricePerLiter: 4.8,
    hasDeal: false,
    variations: [
      {
        id: 'var-rec-3',
        title: 'Regular',
        price: 12.00
      }
    ]
  }
];

export const mockServiceFeeRanges = [
  {
    min: 1.00,
    max: 9.99,
    fee: 2.00
  },
  {
    min: 10.00,
    max: null,
    fee: 0
  }
];

export const mockCoupon = {
  code: 'SAVE10',
  discount: 10, // 10%
  description: '10% off your order'
};

export const mockConfiguration = {
  currencySymbol: '€',
  minimumOrder: 1,
  deliveryCharges: 2.50,
  taxRate: 0.09 // 9%
};

/**
 * Helper function to generate mock cart item
 */
export const generateMockCartItem = (overrides = {}) => {
  return {
    key: `cart-item-${Date.now()}`,
    id: `product-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Sample Product',
    description: 'Sample product description',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    price: 10.00,
    variationId: 'var-default',
    variationTitle: 'Regular',
    addons: [],
    quantity: 1,
    ...overrides
  };
};

/**
 * Helper function to generate mock product
 */
export const generateMockProduct = (overrides = {}) => {
  return {
    id: `product-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Sample Product',
    description: 'Sample product description',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
    price: 10.00,
    volume: '100 g',
    pricePerLiter: 10.0,
    hasDeal: false,
    dealText: '',
    variations: [
      {
        id: 'var-1',
        title: 'Small',
        price: 8.00
      },
      {
        id: 'var-2',
        title: 'Medium',
        price: 10.00
      },
      {
        id: 'var-3',
        title: 'Large',
        price: 12.00
      }
    ],
    ...overrides
  };
};

/**
 * Sample usage in development/testing
 */
export const populateCartWithMockData = async (cartStore) => {
  try {
    // Clear existing cart
    await cartStore.clearCart();
    
    // Add mock items
    for (const item of mockCartItems) {
      await cartStore.addToCart(item);
    }
    
    console.log('Cart populated with mock data');
  } catch (error) {
    console.error('Error populating cart:', error);
  }
};

export default {
  mockCartItems,
  mockRecommendedProducts,
  mockServiceFeeRanges,
  mockCoupon,
  mockConfiguration,
  generateMockCartItem,
  generateMockProduct,
  populateCartWithMockData
};
