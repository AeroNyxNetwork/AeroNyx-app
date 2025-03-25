/*
 * @Description:
 * @Date: 2025-03-19 13:01:25
 * @LastEditTime: 2025-03-25 11:06:35
 */
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";
import idlq2 from "./idlq2.json";
import { Idl, BN } from "@project-serum/anchor";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
const connection = new Connection(
  "https://rpc.mainnet.soo.network/rpc",
  "confirmed"
);
const PROGRAM_ID = new PublicKey(
  "H2aszJ8sGnEhCA6VZAZxGLANwYpV9NoJw3CUoWsne5NG"
);
const mint = new PublicKey("Asir7FbvXa7v7JjiijNVf7s1bUk45TuoWVLK2QwnsWwi");

const programIdl: Idl = idl as Idl;
const programidlq2: Idl = idlq2 as Idl;

export async function getBalance(publicKey: PublicKey) {
  try {
    const tokenAccountAddress = getAssociatedTokenAddressSync(mint, publicKey);

    const tokenAccount = await getAccount(connection, tokenAccountAddress);
    return {
      code: 0,
      number: new BN(tokenAccount.amount).toNumber() / 1e9,
    };
  } catch (error) {
    console.error("Error in getBalance:", error);
    return {
      code: 1,
    };
  }
}
