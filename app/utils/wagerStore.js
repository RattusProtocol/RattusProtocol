import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import io from 'socket.io-client';

// Create a shared Socket.IO connection for real-time updates
const socket = typeof window !== 'undefined' ? 
  io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') : null;

const useWagerStore = create(
  persist(
    (set, get) => ({
      wagers: {},
      totalWagered: 0,
      
      addWager: (walletAddress, ratId, amount) => {
        set((state) => {
          const newWagers = {
            ...state.wagers,
            [walletAddress]: {
              ...state.wagers[walletAddress],
              [ratId]: (state.wagers[walletAddress]?.[ratId] || 0) + amount
            }
          };
          
          // Send update via Socket.IO
          if (socket?.connected) {
            socket.emit('new_wager', {
              walletAddress,
              ratId,
              amount
            });
          }
          
          return {
            wagers: newWagers,
            totalWagered: get().getTotalWagered()
          };
        });
      },
      
      getWalletWagers: (walletAddress) => get().wagers[walletAddress] || {},
      
      getRatWagers: (ratId) => {
        const allWagers = get().wagers;
        return Object.values(allWagers).reduce((total, walletWagers) => {
          return total + (walletWagers[ratId] || 0);
        }, 0);
      },
      
      getWalletTotal: (walletAddress) => {
        const walletWagers = get().wagers[walletAddress] || {};
        return Object.values(walletWagers).reduce((a, b) => a + b, 0);
      },
      
      getTotalWagered: () => {
        const allWagers = get().wagers;
        return Object.values(allWagers).reduce((total, walletWagers) => {
          return total + Object.values(walletWagers).reduce((a, b) => a + b, 0);
        }, 0);
      },

      resetStore: () => set({ wagers: {}, totalWagered: 0 })
    }),
    {
      name: 'wager-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
);

// Handle Socket.IO messages
if (socket) {
  socket.on('wager_update', (data) => {
    useWagerStore.setState({
      wagers: data.wagers,
      totalWagered: data.totalWagered
    });
  });
}

export default useWagerStore; 