import { generateMarketData } from '../../utils/simulatedMarket';

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const data = generateMarketData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
  }
} 