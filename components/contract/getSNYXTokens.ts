import * as anchor from "@project-serum/anchor"; // Anchor framework
import { Connection, PublicKey } from "@solana/web3.js";
import idlq2 from "./idlq2.json";
import { Idl } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
const connection = new Connection(
  "https://rpc.mainnet.soo.network/rpc",
  "confirmed"
);
const mint = new anchor.web3.PublicKey(
  "Asir7FbvXa7v7JjiijNVf7s1bUk45TuoWVLK2QwnsWwi"
);
const { SystemProgram } = anchor.web3; // Reference to the Solana System Program
// Get the Associated Token Program ID from Anchor's utility functions
const ASSOCIATED_PROGRAM_ID = anchor.utils.token.ASSOCIATED_PROGRAM_ID; // Associated Token Program ID
// Get the SPL Token Program ID from Anchor's utility functions
const TOKEN_PROGRAM_ID = anchor.utils.token.TOKEN_PROGRAM_ID; // SPL Token Program ID
// Cast the imported idlq2 JSON to the Idl type for type safety
const programidlq2: Idl = idlq2 as Idl; // Program IDL
// Define the return type for the function: an object with a code and a message string
type Result = { code: "success" | "error"; msg: string };
// Export an asynchronous function to request SNYX tokens with typed parameters
export const GetSNYXTokens = async (
  wallet: WalletAdapter | null | any, // Wallet parameter with a wallet adapter
  publicKey: PublicKey | null // User's public key of type PublicKey
): Promise<Result> => {
  // Function returns a Promise with the Result type
  try {
    if (!wallet.adapter || !publicKey) {
      return {
        code: "error", // Indicate error
        msg: "", // Error message details
      };
    }
    // Extract the wallet adapter from the provided wallet object for signing transactions
    let walletAdapterData: any = wallet.adapter; // Wallet adapter
    // Store the user's public key for clarity
    let walletPublicKey = publicKey; // User's public key
    // Create an Anchor provider with the connection, wallet adapter, and preflight commitment level
    const provider = new anchor.AnchorProvider(connection, walletAdapterData, {
      preflightCommitment: "confirmed",
    }); // Anchor provider setup

    // Set the global provider for Anchor
    anchor.setProvider(provider); // Configure Anchor to use the created provider

    // Define the program ID for the token request (faucet) program
    const programIdToken = new PublicKey(
      "3VX9ayQVFn2GRExavyEiCxAq68HvTC5BtH5EKKbAnuJH"
    ); // Program ID for token faucet

    // Initialize the Anchor program using the provided IDL, program ID, and provider
    const program = new anchor.Program(programidlq2, programIdToken, provider); // Create program instance

    // Create seed prefixes as buffers for deriving Program Derived Addresses (PDAs)
    const faucet_seedPrefix = Buffer.from("faucet"); // Seed prefix for faucet PDA
    const user_seedPrefix = Buffer.from("user"); // Seed prefix for user PDA

    // Derive the faucet PDA using the faucet seed prefix and the token program ID
    const [faucet] = await PublicKey.findProgramAddressSync(
      [faucet_seedPrefix],
      programIdToken
    ); // Find faucet PDA

    // Derive the vault (associated token account) address using the mint and faucet PDA; 'true' indicates it's a PDA
    const vault = await getAssociatedTokenAddress(mint, faucet, true); // Get vault token account address

    // Derive the user PDA using the user seed prefix and the user's public key as a buffer
    const [user] = await PublicKey.findProgramAddressSync(
      [user_seedPrefix, walletPublicKey.toBuffer()],
      programIdToken
    ); // Find user PDA

    // Derive the user's associated token account address for the given mint
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      walletPublicKey
    ); // Get user's token account address

    // Call the program's requestTokens method with the specified accounts and send the transaction
    const txSignature = await program.methods
      .requestTokens() // Invoke the requestTokens instruction
      .accounts({
        faucet, // Faucet PDA account
        vault, // Vault token account
        user, // User PDA account
        userTokenAccount, // User's associated token account
        mint, // Token mint address
        owner: walletPublicKey, // Owner of the token account (user)
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID, // Associated Token Program ID
        TokenProgram: TOKEN_PROGRAM_ID, // SPL Token Program ID
        systemProgram: SystemProgram.programId, // System Program ID
      })
      .signers([]) // No additional signers required
      .rpc(); // Send the transaction via RPC

    // Return a success object containing the transaction signature
    return {
      code: "success", // Indicate success
      msg: txSignature, // Transaction signature as message
    };
  } catch (err: any) {
    // If an error occurs, return an error object with the error message
    return {
      code: "error", // Indicate error
      msg: err?.message || JSON.stringify(err), // Error message details
    };
  }
};
