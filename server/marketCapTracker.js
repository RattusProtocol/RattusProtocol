const { Connection, PublicKey } = require("@solana/web3.js");

const RAY_PROGRAM = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const PUMP_PROGRAM = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const WSOL_MINT = "So11111111111111111111111111111111111111112";
const JUPITER_PROGRAM = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";

class MarketCapTracker {
  constructor(io) {
    this.io = io;
    this.tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
    this.connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC_URL, {
      wsEndpoint: process.env.NEXT_PUBLIC_HELIUS_WS_URL,
      commitment: 'confirmed'
    });
    this.tokenData = {
      lastPrice: 0,
      supply: 0,
      marketCap: 0,
      lastValidMarketCap: 0,
      lastTrade: null,
      metadata: null
    };
    this.highestMarketCap = 0;
    this.lastUpdate = Date.now();
    this.retryDelay = 1000;
    this.solPrice = 200;
    this.subscription = null;
    this.isProcessing = false;
    this.startTracking();
    this.startSolPriceTracking();
  }

  async fetchSolPrice() {
    try {
      const response = await fetch('https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112');
      const data = await response.json();
      if (data.data?.So11111111111111111111111111111111111111112?.price) {
        this.solPrice = parseFloat(data.data.So11111111111111111111111111111111111111112.price);
        console.log('Updated SOL price:', this.solPrice);
      }
    } catch (error) {
      console.error('Error fetching SOL price:', error);
    }
  }

  startSolPriceTracking() {
    this.fetchSolPrice();
    setInterval(() => this.fetchSolPrice(), 10000);
  }

  async startTracking() {
    if (!this.tokenAddress) {
      console.error('No token address provided in environment variables');
      return;
    }

    try {
      console.log('Starting tracking for token:', this.tokenAddress);
      
      // Subscribe to logs that mention our token
      this.subscription = this.connection.onLogs(
        new PublicKey(this.tokenAddress),
        async (logs, context) => {
          if (this.isProcessing) {
            console.log('Skipping transaction - already processing');
            return;
          }

          try {
            this.isProcessing = true;
            console.log('Processing new transaction');
            
            const transaction = await this.connection.getParsedTransaction(
              logs.signature,
              {
                maxSupportedTransactionVersion: 10
              }
            );

            if (transaction) {
              await this.processTransaction(transaction);
            }
          } catch (error) {
            console.error('Error processing log:', error);
          } finally {
            this.isProcessing = false;
          }
        },
        'confirmed'
      );

      console.log('Log subscription started');
    } catch (error) {
      console.error('Error starting tracking:', error);
      this.isProcessing = false;
    }
  }

  async processTransaction(transaction) {
    try {
      if (!transaction || !transaction.meta) return;

      const signer = transaction.transaction.message.accountKeys.find(key => key.signer).pubkey.toBase58();
      const programIds = transaction.transaction.message.accountKeys.map(key => key.pubkey.toBase58());

      // Rest of your existing transaction processing logic
      const isRaydium = programIds.includes(RAY_PROGRAM);
      const isPumpFun = programIds.includes(PUMP_PROGRAM);
      const isJupiter = programIds.includes(JUPITER_PROGRAM);

      if ((!isRaydium && !isPumpFun) || isJupiter) return;

      // Calculate amounts and market cap
      const preTokenBalances = transaction.meta.preTokenBalances.filter(balance => 
        balance.owner === signer && balance.mint === this.tokenAddress
      );
      const postTokenBalances = transaction.meta.postTokenBalances.filter(balance => 
        balance.owner === signer && balance.mint === this.tokenAddress
      );

      const tokenAmount = Math.abs(
        (postTokenBalances[0]?.uiTokenAmount.uiAmount || 0) - 
        (preTokenBalances[0]?.uiTokenAmount.uiAmount || 0)
      );

      if (tokenAmount === 0) return;

      const solAmount = Math.abs(
        transaction.meta.preBalances[0] - 
        transaction.meta.postBalances[0]
      ) / 1000000000;

      if (solAmount < 0.1) return;

      const TOTAL_SUPPLY = 1_000_000_000;
      const price = (solAmount * this.solPrice) / tokenAmount;
      const marketCap = price * TOTAL_SUPPLY;

      // Update token data with validation
      if (marketCap > 0) {
        this.tokenData.lastValidMarketCap = marketCap;
      }
      this.tokenData.lastPrice = price;
      this.tokenData.supply = TOTAL_SUPPLY;
      this.tokenData.marketCap = marketCap;
      this.tokenData.lastTrade = Date.now();

      console.log('marketCap', marketCap);

      this.broadcastUpdate();
      this.lastUpdate = Date.now();

    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  }

  broadcastUpdate() {
    const marketCapToSend = this.tokenData.marketCap > 0 
      ? this.tokenData.marketCap 
      : this.tokenData.lastValidMarketCap;

    if (marketCapToSend <= 0) return;

    this.updateHighestMarketCap(marketCapToSend);

    this.io.emit('marketCapUpdate', [{
      address: this.tokenAddress,
      data: {
        price: this.tokenData.lastPrice,
        supply: this.tokenData.supply,
        marketCap: marketCapToSend,
        highestMarketCap: this.highestMarketCap,
        lastTrade: this.tokenData.lastTrade,
        metadata: {
          symbol: this.tokenData.metadata?.symbol
        }
      }
    }]);
  }

  async fetchTokenMetadata(tokenAddress) {
    try {
      // Get the token mint info first
      const mintInfo = await this.connection.getParsedAccountInfo(new PublicKey(tokenAddress));
      if (!mintInfo.value) return null;

      // For now, return basic metadata since we can't get the actual metadata
      return {
        name: "Token",
        symbol: "TKN",
        image: null,
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return {
        name: "Token",
        symbol: "TKN",
        image: null,
      };
    }
  }

  stopTracking() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  updateHighestMarketCap(marketCap) {
    if (marketCap > this.highestMarketCap) {
      this.highestMarketCap = marketCap;
    }
  }
}

module.exports = { MarketCapTracker };