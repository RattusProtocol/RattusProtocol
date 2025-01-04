import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export function useMarketCap() {
  const [marketCap, setMarketCap] = useState(0);
  const [highestMarketCap, setHighestMarketCap] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastValidMarketCapRef = useRef(0);

  const updateMarketCap = useCallback((newMarketCap) => {
    setMarketCap(newMarketCap);
    lastValidMarketCapRef.current = newMarketCap;
    
    // Update highest market cap if new value is higher
    if (newMarketCap > highestMarketCap) {
      setHighestMarketCap(newMarketCap);
    }
  }, [highestMarketCap]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000');
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError(error);
    });
    
    // Get initial market cap and highest market cap
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/marketcap`),
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/highest-marketcap`)
    ])
      .then(([marketCapRes, highestMarketCapRes]) => 
        Promise.all([marketCapRes.json(), highestMarketCapRes.json()])
      )
      .then(([marketCapData, highestMarketCapData]) => {
        if (marketCapData.marketCap > 0) {
          updateMarketCap(marketCapData.marketCap);
        }
        if (highestMarketCapData.marketCap > 0) {
          setHighestMarketCap(highestMarketCapData.marketCap);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching market cap data:', err);
        setError(err);
        setIsLoading(false);
      });

    // Listen for market cap updates
    socket.on('marketCapUpdate', (updates) => {
      const tokenUpdate = updates.find(u => 
        u.address === process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
      );
      
      if (tokenUpdate?.data) {
        const newMarketCap = tokenUpdate.data.marketCap;
        const newHighestMarketCap = tokenUpdate.data.highestMarketCap;
        
        console.log('New market cap:', newMarketCap, 'Highest:', newHighestMarketCap);
        
        updateMarketCap(newMarketCap);
        if (newHighestMarketCap > highestMarketCap) {
          setHighestMarketCap(newHighestMarketCap);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [updateMarketCap]);

  return { marketCap, highestMarketCap, isLoading, error };
} 