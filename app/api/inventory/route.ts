import { NextResponse } from 'next/server';
import { getInventory } from '@/lib/data';

export async function GET() {
  try {
    const inventory = getInventory();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}