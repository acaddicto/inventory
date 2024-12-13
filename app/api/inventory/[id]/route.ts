// app/api/inventory/[id]/route.ts
import { NextResponse } from 'next/server';
import { inventoryData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = inventoryData.find(item => item.id === params.id);
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}