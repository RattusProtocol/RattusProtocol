const BASE_PRICES = {
  bitcoin: 50000,
  ethereum: 3000,
  dogecoin: 0.1
};

const VOLATILITY = 0.05; // 5% volatility

export function generateMarketData() {
  const data = {};
  
  Object.entries(BASE_PRICES).forEach(([coin, basePrice]) => {
    // Random price fluctuation
    const randomFactor = 1 + (Math.random() - 0.5) * VOLATILITY;
    const price = basePrice * randomFactor;
    
    // Simulated market cap (price * arbitrary supply)
    const marketCap = price * (coin === 'bitcoin' ? 19_000_000 : 
                             coin === 'ethereum' ? 120_000_000 : 
                             132_000_000_000);
    
    data[coin] = {
      usd: price,
      usd_market_cap: marketCap
    };
  });
  
  return data;
} 