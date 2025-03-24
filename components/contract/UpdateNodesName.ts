import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";
import { Idl } from "@project-serum/anchor";
import crypto from "crypto";

const PROGRAM_ID = new PublicKey(
  "H2aszJ8sGnEhCA6VZAZxGLANwYpV9NoJw3CUoWsne5NG"
);
const connection = new Connection(
  "https://rpc.mainnet.soo.network/rpc",
  "confirmed"
);
const programIdl: Idl = idl as Idl;

export async function UpdateNodesName(
  newName: string,
  InputPublicKey: string,
  wallet: any,
  publicKey: PublicKey
) {
  const walletPublicKey = publicKey;
  wallet = wallet.adapter;
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  const program = new anchor.Program(programIdl, PROGRAM_ID, provider);
  const seedPrefix = Buffer.from("server");
  const serverPublicKey = Buffer.from(InputPublicKey, "hex");
  const serverkeyBuffer = crypto
    .createHash("sha256")
    .update(serverPublicKey)
    .digest();
  const [infoAccount] = PublicKey.findProgramAddressSync(
    [seedPrefix, serverkeyBuffer],
    PROGRAM_ID
  );

  try {
    const txSignature = await program.methods
      .updateServer(newName)
      .accounts({
        infoAccount,
        owner: walletPublicKey,
      })
      .signers([])
      .rpc();
    return {
      code: "success",
      data: txSignature,
    };
  } catch (err) {
    return {
      code: "error",
      msg: err,
    };
  }
}
