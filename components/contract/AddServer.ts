/*
 * @Description:
 * @Date: 2025-03-24 15:10:29
 * @LastEditTime: 2025-03-24 17:48:35
 */
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as crypto from "crypto";
import { Idl, AnchorProvider } from "@project-serum/anchor";
import {
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import idl from "./idl.json";
const PROGRAM_ID = new PublicKey(
  "H2aszJ8sGnEhCA6VZAZxGLANwYpV9NoJw3CUoWsne5NG"
);
const connection = new Connection(
  "https://rpc.mainnet.soo.network/rpc",
  "confirmed"
);
const mint = new PublicKey("Asir7FbvXa7v7JjiijNVf7s1bUk45TuoWVLK2QwnsWwi");

const ASSOCIATED_PROGRAM_ID = anchor.utils.token.ASSOCIATED_PROGRAM_ID;
const TOKEN_PROGRAM_ID = anchor.utils.token.TOKEN_PROGRAM_ID;
const programIdl: Idl = idl as Idl;
export async function AddServer(
  name: string,
  stakeAmount: number,
  inputPublicKey: string,
  wallet: any,
  walletPublicKey: any
) {
  const walletAdapter = wallet.adapter;
  const provider = new AnchorProvider(connection, walletAdapter, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new anchor.Program(programIdl, PROGRAM_ID, provider);
  const serverPublicKeyBuffer = Buffer.from(inputPublicKey, "hex");
  const serverKeyBuffer = crypto
    .createHash("sha256")
    .update(serverPublicKeyBuffer)
    .digest();
  const [infoAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("server"), serverKeyBuffer],
    program.programId
  );
  const vault = await getAssociatedTokenAddress(mint, infoAccount, true);
  const senderTokenAccount = await getAssociatedTokenAddress(
    mint,
    walletPublicKey
  );
  const seedPrefixMain = Buffer.from("main");
  const [mainAccount, bumpMain] = PublicKey.findProgramAddressSync(
    [seedPrefixMain],
    program.programId
  );

  const bnStakeAmount = new anchor.BN(stakeAmount * Math.pow(10, 9));

  try {
    const tx = await program.methods
      .addServer(serverPublicKeyBuffer, name, bnStakeAmount)
      .accounts({
        mainAccount: mainAccount,
        infoAccount: infoAccount,
        senderTokenAccount: senderTokenAccount,
        vault: vault,
        mint: mint,
        owner: walletPublicKey,
        TokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log(`Transaction successful with ID: ${tx}`);
    return {
      code: "success",
      msg: tx,
    };
  } catch (err: any) {
    console.error("Error in AddServer:", err);
    return {
      code: "error",
      msg: err,
    };
  }
}
