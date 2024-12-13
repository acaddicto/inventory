// app/api/inventory/update/route.ts
import { NextResponse } from 'next/server';
import { updateInventory } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    updateInventory(items);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}