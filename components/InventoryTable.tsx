// components/InventoryTable.tsx
'use client';

import { useState } from 'react';
import { InventoryItem } from '@/types/inventory';

interface Props {
  items: InventoryItem[];
  onItemClick: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onItemClick }: Props) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Item Name</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Current Stock</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Cost/Unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
              <td className={`px-6 py-4 text-right text-sm ${
                item.currentStock < item.minStock ? 'text-red-600 font-medium' : 'text-gray-800'
              }`}>
                {item.currentStock} {item.unit}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-800">
                ${item.costPerUnit.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}