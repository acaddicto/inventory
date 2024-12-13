// types/inventory.ts
export interface InventoryItem {
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    costPerUnit: number;
    unit: string;
    category: string;
    supplier: string;
    lastRestocked: string;
    description: string;
    expiryDate?: string;
    location: string;
  }