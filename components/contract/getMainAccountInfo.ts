import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import crypto from "crypto";
import idl from "./idl.json";
import { Idl, AnchorProvider, BN } from "@project-serum/anchor";
import type { WalletAdapter } from "@solana/wallet-adapter-base";

const PROGRAM_ID = new PublicKey(
  "H2aszJ8sGnEhCA6VZAZxGLANwYpV9NoJw3CUoWsne5NG"
);
const connection = new Connection(
  "https://rpc.mainnet.soo.network/rpc",
  "confirmed"
);
const programIdl: Idl = idl as Idl;

export async function getMainAccountInfo(serverKey: string, wallet: any) {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);

  const serverPublicKey = Buffer.from(serverKey, "hex");
  const serverKeyBuffer = crypto
    .createHash("sha256")
    .update(serverPublicKey)
    .digest();

  const [infoAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("server"), serverKeyBuffer],
    PROGRAM_ID
  );

  try {
    const program = new anchor.Program(programIdl, PROGRAM_ID, provider);
    const accountData = await program.account.infoAccount.fetch(infoAccount);
    return {
      code: 0,
      number: new BN(accountData.stake).toNumber() / 1e9,
      contractName: accountData.name,
    };
  } catch (err) {
    return {
      code: 1,
      msg: err,
    };
  }
}
