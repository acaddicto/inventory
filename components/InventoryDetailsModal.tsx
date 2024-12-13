// components/InventoryDetailsModal.tsx
import { InventoryItem } from '@/types/inventory';

interface InventoryDetailsModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function InventoryDetailsModal({ item, onClose }: InventoryDetailsModalProps) {
  if (!item) return null;

  const stockValue = item.currentStock * item.costPerUnit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Key Metrics - Equal Prominence */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Current Stock</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${
                  item.currentStock < item.minStock ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {item.currentStock}
                </p>
                <p className="ml-1 text-gray-600">{item.unit}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stockValue.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Minimum Stock Level</p>
                <p className="text-lg font-medium text-gray-900">{item.minStock} {item.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost per Unit</p>
                <p className="text-lg font-medium text-gray-900">${item.costPerUnit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-lg font-medium text-gray-900">{item.category}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-lg font-medium text-gray-900">{item.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Restocked</p>
                <p className="text-lg font-medium text-gray-900">{item.lastRestocked}</p>
              </div>
              {item.expiryDate && (
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="text-lg font-medium text-gray-900">{item.expiryDate}</p>
                </div>
              )}
            </div>
          </div>

          {item.description && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1 text-gray-900">{item.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}