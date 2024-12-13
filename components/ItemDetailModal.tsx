// components/ItemDetailModal.tsx
'use client';

import { InventoryItem } from '@/types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Current Stock</p>
                <p className={`font-medium ${
                  item.currentStock < item.minStock ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {item.currentStock} {item.unit}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Minimum Stock</p>
                <p className="font-medium text-gray-900">{item.minStock} {item.unit}</p>
              </div>
              <div>
                <p className="text-gray-500">Cost per Unit</p>
                <p className="font-medium text-gray-900">${item.costPerUnit.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{item.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Supplier</p>
                <p className="font-medium text-gray-900">{item.supplier}</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{item.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-500">Description</p>
            <p className="mt-1 text-gray-900">{item.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Last Restocked</p>
              <p className="font-medium text-gray-900">
                {new Date(item.lastRestocked).toLocaleDateString()}
              </p>
            </div>
            {item.expiryDate && (
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}