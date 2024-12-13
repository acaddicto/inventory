// lib/data.ts
import { InventoryItem } from '@/types/inventory';

// Initialize with some data
let inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    currentStock: 55,
    minStock: 50,
    costPerUnit: 2.5,
    unit: 'kg',
    category: 'Grains',
    supplier: 'Global Foods Inc',
    lastRestocked: '2024-12-01',
    description: 'Premium long-grain basmati rice',
    expiryDate: '2025-12-01',
    location: 'Dry Storage A1'
  },
  {
    id: '2',
    name: 'Bacon Raw',
    currentStock: 25,
    minStock: 20,
    costPerUnit: 5.0,
    unit: 'kg',
    category: 'Meat',
    supplier: 'Farm Fresh Poultry',
    lastRestocked: '2024-12-05',
    description: 'Boneless skinless chicken breast',
    expiryDate: '2024-12-20',
    location: 'Freezer B2'
  },
  {
    id: '3',
    name: 'Potatoes',
    currentStock: 70,
    minStock: 80,
    costPerUnit: 1.2,
    unit: 'kg',
    category: 'Vegetables',
    supplier: 'Green Valley Produce',
    lastRestocked: '2024-12-10',
    description: 'Fresh organic tomatoes',
    expiryDate: '2024-12-18',
    location: 'Cold Storage C3'
  },
  {
    id: '4',
    name: 'Cheddar Cheese',
    currentStock: 15,
    minStock: 20,
    costPerUnit: 4.5,
    unit: 'kg',
    category: 'Dairy',
    supplier: 'Dairy Delights',
    lastRestocked: '2024-12-03',
    description: 'Aged cheddar cheese',
    expiryDate: '2025-02-01',
    location: 'Cold Storage C1'
  },
  {
    id: '5',
    name: 'Olive Oil',
    currentStock: 30,
    minStock: 20,
    costPerUnit: 10.0,
    unit: 'liters',
    category: 'Oils',
    supplier: 'Mediterranean Essentials',
    lastRestocked: '2024-12-07',
    description: 'Extra virgin olive oil',
    expiryDate: '2025-06-30',
    location: 'Dry Storage A2'
  },
  {
    id: '6',
    name: 'All-Purpose Flour',
    currentStock: 50,
    minStock: 40,
    costPerUnit: 1.0,
    unit: 'kg',
    category: 'Grains',
    supplier: 'Baker’s Choice',
    lastRestocked: '2024-12-04',
    description: 'High-quality all-purpose flour',
    expiryDate: '2025-12-04',
    location: 'Dry Storage A3'
  },
  {
    id: '7',
    name: 'Salmon Fillet',
    currentStock: 10,
    minStock: 15,
    costPerUnit: 12.0,
    unit: 'kg',
    category: 'Seafood',
    supplier: 'Ocean Harvest',
    lastRestocked: '2024-12-08',
    description: 'Freshly caught salmon fillet',
    expiryDate: '2024-12-15',
    location: 'Freezer B1'
  },
  // ... other initial items
];

// Function to get inventory
export function getInventory(): InventoryItem[] {
  return inventoryData;
}

// Function to update inventory
export function updateInventory(newItems: any[]): void {
  newItems.forEach(newItem => {
    const existingItem = inventoryData.find(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    
    if (existingItem) {
      // Update existing item
      existingItem.currentStock += newItem.quantity;
      existingItem.costPerUnit = newItem.costPerUnit; // Update cost if changed
      existingItem.lastRestocked = new Date().toISOString().split('T')[0];
    } else {
      // Add new item
      const newInventoryItem: InventoryItem = {
        id: String(inventoryData.length + 1),
        name: newItem.name,
        currentStock: newItem.quantity,
        minStock: Math.floor(newItem.quantity * 0.2), // Set min stock to 20% of received quantity
        costPerUnit: newItem.costPerUnit,
        unit: newItem.unit,
        category: 'New Items',
        supplier: 'TBD',
        lastRestocked: new Date().toISOString().split('T')[0],
        description: `New item added from invoice`,
        location: 'Main Storage'
      };
      inventoryData.push(newInventoryItem);
    }
  });
}