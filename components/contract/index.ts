// /*
//  * @Description:
//  * @Date: 2025-03-17 10:49:52
//  * @LastEditTime: 2025-03-17 10:59:40
//  */
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
// const crypto = require("crypto");

// // 配置
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
// ); // 代币的公钥

// const ASSOCIATED_PROGRAM_ID = anchor.utils.token.ASSOCIATED_PROGRAM_ID;
// const TOKEN_PROGRAM_ID = anchor.utils.token.TOKEN_PROGRAM_ID;
// const PROGRAM_IDL = idl as anchor.Idl;
// const PROGRAM_IDL_Q2 = idlq2 as anchor.Idl;

// // 创建 Anchor Provider
// const createProvider = (wallet) => {
//   return new anchor.AnchorProvider(CONNECTION, wallet.adapter, {
//     preflightCommitment: "confirmed",
//   });
// };

// // 计算 PDA 地址
// const findPdaAccount = (seed: string, buffer: Buffer, programId: PublicKey) => {
//   return PublicKey.findProgramAddressSync(
//     [Buffer.from(seed), buffer],
//     programId
//   );
// };

// // 计算 Token 账户地址
// const getTokenAccount = async (
//   mint: PublicKey,
//   owner: PublicKey,
//   allowOffCurve = false
// ) => {
//   return await getAssociatedTokenAddress(mint, owner, allowOffCurve);
// };

// // 通用合约调用
// const executeTransaction = async (method, accounts, args = []) => {
//   try {
//     const tx = await method(...args)
//       .accounts(accounts)
//       .signers([])
//       .rpc();
//     console.log(`Transaction successful: ${tx}`);
//     return { code: "success", msg: tx };
//   } catch (err) {
//     console.error("Transaction error:", err);
//     return { code: "error", msg: err.message || JSON.stringify(err) };
//   }
// };
