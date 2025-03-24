/*
 * @Description:
 * @Date: 2025-03-24 16:21:43
 * @LastEditTime: 2025-03-24 17:57:25
 */
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";
import { Idl } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import crypto from "crypto";

const { SystemProgram } = anchor.web3;
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

export async function MyNode_Deposis(
  wallet: any,
  publicKey: PublicKey,
  amount: number,
  InputPublicKey: string
) {
  wallet = wallet.adapter;
  const walletPublicKey = publicKey;
  const serverPublicKey = Buffer.from(InputPublicKey, "hex");
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new anchor.Program(programIdl, PROGRAM_ID, provider);
  const serverkeyBuffer = crypto
    .createHash("sha256")
    .update(serverPublicKey)
    .digest();
  const [infoAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("server"), serverkeyBuffer],
    program.programId
  );
  const vault = await getAssociatedTokenAddress(mint, infoAccount, true);
  const senderTokenAccount = await getAssociatedTokenAddress(
    mint,
    walletPublicKey
  );
  const [mainAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("main")],
    program.programId
  );
  const BnNumber = amount * 1e9;
  try {
    const txSignatureAll = await program.methods
      .deposit(new anchor.BN(BnNumber))
      .accounts({
        mainAccount,
        infoAccount,
        vault,
        mint,
        senderTokenAccount,
        owner: walletPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();
    return { code: "success", msg: txSignatureAll };
  } catch (err) {
    return { code: "error", msg: String(err) };
  }
}
