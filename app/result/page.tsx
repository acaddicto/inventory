// app/result/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ConfirmModal';

interface ReceivedItem {
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  matchedInventoryId?: string;
}

interface ProcessedInvoice {
  items: ReceivedItem[];
  invoiceNumber?: string;
  date?: string;
  supplier?: string;
}

export default function ResultPage() {
  const [invoiceData, setInvoiceData] = useState<ProcessedInvoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();


 // In ResultPage component, update the useEffect:

useEffect(() => {
    try {
      const data = localStorage.getItem('scanResult');
      console.log('Retrieved data:', data); // Debug log
      
      if (!data) {
        setError('No invoice data found');
        return;
      }
  
      try {
        const parsedData = JSON.parse(data);
        console.log('Parsed data with matches:', parsedData); 
  
        // Validate structure
        if (!parsedData || typeof parsedData !== 'object') {
          throw new Error('Invalid data format: not an object');
        }
  
        if (!Array.isArray(parsedData.items)) {
          throw new Error('Invalid data format: items is not an array');
        }
  
        // Validate and sanitize items
        const sanitizedItems = parsedData.items.map(item => ({
          name: String(item.name || ''),
          quantity: Number(item.quantity || 0),
          unit: String(item.unit || ''),
          costPerUnit: Number(item.costPerUnit || 0),
          matchedInventoryId: item.matchedInventoryId
        }));
  
        setInvoiceData({
          items: sanitizedItems,
          invoiceNumber: String(parsedData.invoiceNumber || ''),
          date: String(parsedData.date || ''),
          supplier: String(parsedData.supplier || '')
        });
  
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error(`Invalid data format: ${parseError.message}`);
      }
    } catch (err) {
      console.error('Error loading scan result:', err);
      setError(err instanceof Error ? err.message : 'Failed to load invoice data');
    }
  }, []);

  const handleCheckboxChange = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (selectedItems.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleApprove = async () => {
    try {
      if (!invoiceData) return;

      const approvedItems = Array.from(selectedItems).map(index => {
        const item = invoiceData.items[index];
        if (!item) throw new Error('Invalid item index');
        return item;
      });
      
      const response = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: approvedItems,
          invoiceNumber: invoiceData.invoiceNumber,
          date: invoiceData.date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update inventory');
      }

      router.push('/');
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert(error instanceof Error ? error.message : 'Failed to update inventory');
    }
  };

  const handleSelectAll = () => {
    if (!invoiceData) return;
    
    if (selectedItems.size === invoiceData.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(invoiceData.items.map((_, index) => index)));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Replace the existing header section with this */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-500">Invoice</span>
                <span className="mx-2">·</span>
                <span>{invoiceData.invoiceNumber}</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-3 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{invoiceData.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{invoiceData.supplier}</span>
              </div>
            </div>
          </div>

          {/* Select All button */}
          <div className="mb-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedItems.size === invoiceData.items.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          

          {/* Table */}
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Name
                  </th>
                  <th className="w-20 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="w-32 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Cost
                  </th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData?.items.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedItems.has(index) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{item.quantity} {item.unit} </td>
                    <td className="px-4 py-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-600">${item.costPerUnit.toFixed(2)}/unit</div>
                        <div className="text-sm font-semibold text-gray-900">
                          ${(item.quantity * item.costPerUnit).toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.matchedInventoryId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${invoiceData?.items.reduce((sum, item) => 
                      sum + (item.quantity * item.costPerUnit), 0
                    ).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={selectedItems.size === 0}
              className={`px-4 py-2 text-white rounded-lg ${
                selectedItems.size === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Approve Selected Items
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          handleApprove();
        }}
        itemCount={selectedItems.size}
      />
    </div>
  );
}
