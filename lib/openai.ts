// lib/openai.ts
import OpenAI from 'openai';
import { getInventory } from './data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function processFile(base64Image: string): Promise<string> {
  try {
    console.log('Sending request to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Updated model name
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract only the inventory items with their quantities and unit prices from this invoice. Return in this exact JSON format: { items: [{ name: string, quantity: number, unit: string, costPerUnit: number }], invoiceNumber: string, date: string, supplier: string }"
            },
            {
              type: "image_url",
              image_url: { url: base64Image }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    console.log('OpenAI Raw Response:', response);
    
    // Parse the OpenAI response
    let result = response.choices[0].message.content || '{"items": [], "invoiceNumber": "", "date": "", "supplier": ""}';
    const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResult = JSON.parse(cleanResult);
    
    // Get current inventory for matching
    const inventory = getInventory();
    
    // Match items with existing inventory
    if (parsedResult.items && Array.isArray(parsedResult.items)) {
      parsedResult.items = parsedResult.items.map(item => {
        // Try to find a match in inventory (case-insensitive)
        const matchedItem = inventory.find(
          invItem => invItem.name.toLowerCase() === item.name.toLowerCase()
        );

        return {
          ...item,
          matchedInventoryId: matchedItem ? matchedItem.id : undefined
        };
        console.log('Checking match for:', item.name);
        console.log('Found match:', matchedItem);
      });
    }

    console.log('Processed Result:', parsedResult);
    console.log('Inventory for matching:', inventory);
    console.log('Items to match:', parsedResult.items);
    return JSON.stringify(parsedResult);
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to process invoice');
  }
}