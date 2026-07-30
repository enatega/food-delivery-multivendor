export const CATEGORIES = [
  { id: 'all', title: 'All Items' },
  { id: 'soft', title: 'Soft Drinks' },
  { id: 'water', title: 'Water' },
  { id: 'juice', title: 'Juices' },
  { id: 'energy', title: 'Energy Drinks' },
];


export const SUB_CATEGORIES = [
  { id: 'all', title: 'All Items' },
  { id: 'soft', title: 'Soft Drinks' },
  { id: 'water', title: 'Water' },
  { id: 'juice', title: 'Juices' },
  { id: 'energy', title: 'Energy Drinks' },
];

// create LOTS of data for stress-testing
const baseProducts = [
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Water Bottle', price: 15.4, size: '2 L', category: 'water' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Coca Cola', price: 12.4, size: '250 ml', category: 'soft' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Apple Juice', price: 8.74, size: '250 ml', category: 'juice' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
  { title: 'Red Bull', price: 14.1, size: '250 ml', category: 'energy' },
];

export const PRODUCTS = Array.from({ length: 100 }).flatMap((_, i) =>
  baseProducts.map((p, index) => ({
    id: `${i}-${index}`,
    ...p,
  }))
);
