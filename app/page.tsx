// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InventoryItem } from '@/types/inventory';
import InventoryDetailsModal from '@/components/InventoryDetailsModal';

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        {/* Restaurant Name & Date */}
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Tasty Bites</h1>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Inventory Title & Action Button */}
        <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wider">
            INVENTORY
          </h2>
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Receive Inventory
          </Link>
        </div>
      </div>

      {/* Main Content - Adjusted for header */}
      <div className="pt-28 px-2 pb-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Column Headers */}
          <div className="flex justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase">Item Name</span>
            <span className="text-xs font-medium text-gray-500 uppercase">Stock</span>
          </div>

          {/* Inventory Items */}
          <div className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3 cursor-pointer active:bg-gray-50 ${
                  item.currentStock < item.minStock ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className={`text-sm ${
                    item.currentStock < item.minStock 
                      ? 'text-red-600 font-medium' 
                      : 'text-gray-600'
                  }`}>
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>${item.costPerUnit.toFixed(2)}/unit</span>
                  <span>{new Date(item.lastRestocked).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InventoryDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}