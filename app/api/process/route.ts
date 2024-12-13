// app/api/process/route.ts
import { processFile } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { file } = await req.json();
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Processing file in API route...');
    const result = await processFile(file);
    
    // Parse the result to make sure we preserve all fields
    const parsedResult = JSON.parse(result);
    console.log('Processed result in API:', parsedResult); // Debug log
    
    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}