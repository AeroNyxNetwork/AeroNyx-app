// import * as anchor from "@project-serum/anchor";
// import { Connection, Keypair, Message, PublicKey } from "@solana/web3.js";
// import * as bs58 from "bs58";
// import idl from "./idl.json";
// import idlq2 from "./idlq2.json";
// import { Idl } from "@project-serum/anchor";
// import { json } from "stream/consumers";
// import { observer } from "mobx-react-lite";
// import { counterStore } from "@/app/stores/counterStore";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
// import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
// import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
// import * as web3 from "@solana/web3.js";
// import { AnchorProvider, BN } from "@project-serum/anchor";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
// import {
//   getAccount,
//   getAssociatedTokenAddress,
//   getAssociatedTokenAddressSync,
// } from "@solana/spl-token";
// import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
// const crypto = require("crypto");

// const { SystemProgram } = anchor.web3;
// const PROGRAM_ID = new PublicKey(
//   "H2aszJ8sGnEhCA6VZAZxGLANwYpV9NoJw3CUoWsne5NG"
// );
// const connection = new Connection(
//   "https://rpc.mainnet.soo.network/rpc",
//   "confirmed"
// );
// const mint = new anchor.web3.PublicKey(
//   "Asir7FbvXa7v7JjiijNVf7s1bUk45TuoWVLK2QwnsWwi"
// );

// const ASSOCIATED_PROGRAM_ID = anchor.utils.token.ASSOCIATED_PROGRAM_ID;
// const TOKEN_PROGRAM_ID = anchor.utils.token.TOKEN_PROGRAM_ID;
// const programIdl: Idl = idl as Idl;
// const programidlq2: Idl = idlq2 as Idl;

export async function getMainAccountInfo(
  serverkey: string,
  wallet: WalletAdapter
) {
  return {};
  //   console.log("first", wallet);
  //   console.log("first", serverkey);
  //   console.log("first", 1111111111111);
  //   const provider = new anchor.AnchorProvider(connection, wallet, {
  //     preflightCommitment: "confirmed",
  //   });
  //   anchor.setProvider(provider);
  //   const serverPublicKey = Buffer.from(serverkey, "hex");
  //   const serverkeyBuffer = crypto
  //     .createHash("sha256")
  //     .update(serverPublicKey)
  //     .digest();
  //   const program = new anchor.Program(programIdl, PROGRAM_ID, provider);
  //   const [infoAccount, bump] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("server"), serverkeyBuffer],
  //     PROGRAM_ID
  //   );
  //   try {
  //     // 查询账户数据
  //     const accountData = await program.account.infoAccount.fetch(infoAccount);
  //     return {
  //       code: 0,
  //       number: new BN(accountData.stake).toNumber() / 1e9,
  //       contractName: accountData.name,
  //     };
  //   } catch (err) {
  //     return {
  //       code: 1,
  //       msg: err,
  //     };
  //   }
}
