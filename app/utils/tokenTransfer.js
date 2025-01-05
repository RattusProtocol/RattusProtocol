import { 
  PublicKey, 
  Transaction,
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export async function transferTokens(wallet, tokenAddress, destinationAddress, amount) {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected properly');
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
    const tokenMint = new PublicKey(tokenAddress);
    const destination = new PublicKey(destinationAddress);

    // Get token accounts
    const sourceATA = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
    );
    const destinationATA = await getAssociatedTokenAddress(
      tokenMint,
      destination
    );

    // Create transaction
    const transaction = new Transaction();

    // Check if source ATA exists
    const sourceAccount = await connection.getAccountInfo(sourceATA);
    if (!sourceAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          sourceATA,
          wallet.publicKey,
          tokenMint
        )
      );
    }

    // Check if destination ATA exists
    const destinationAccount = await connection.getAccountInfo(destinationATA);
    if (!destinationAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          destinationATA,
          destination,
          tokenMint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        sourceATA,
        destinationATA,
        wallet.publicKey,
        amount * (10 ** 6) // Using 6 decimals as seen in marketCapTracker.js
      )
    );
    
    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign and send transaction
    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    return true;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
} 