/*
 * @Description:
 * @Date: 2025-03-21 17:26:50
 * @LastEditTime: 2025-03-21 18:43:18
 */
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import * as crypto from "crypto";
import idl from "./idl.json";
import { Idl, AnchorProvider, BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
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
const { SystemProgram } = anchor.web3;
const programIdl: Idl = idl as Idl;

interface DepositResult {
  code: string;
  msg: any;
}

export async function D_withdraw(
  wallet: any,
  publicKey: PublicKey,
  stakeAmount: number,
  serverkey: string,
  owner: string
): Promise<DepositResult> {
  wallet = wallet.adapter;
  const walletPublicKey = publicKey;
  const serverPublicKey = Buffer.from(serverkey, "hex");

  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new anchor.Program(programIdl, PROGRAM_ID, provider);

  const serverkeyBuffer = crypto
    .createHash("sha256")
    .update(serverPublicKey)
    .digest();

  let infoPublicKey = new PublicKey(owner);

  const [infoAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("server"), serverkeyBuffer],
    program.programId
  );

  const senderTokenAccount = await getAssociatedTokenAddress(
    mint,
    walletPublicKey
  );

  const [mainAccount, bumpm] = await PublicKey.findProgramAddressSync(
    [Buffer.from("main")],
    program.programId
  );

  const [delegatedAccount, bumpd] = await PublicKey.findProgramAddressSync(
    [Buffer.from("server"), walletPublicKey.toBuffer(), infoAccount.toBuffer()],
    program.programId
  );

  const vault = await getAssociatedTokenAddress(mint, delegatedAccount, true);

  let BnNumber = Number(stakeAmount) * Math.pow(10, 9);
  try {
    const txSignatureAll = await program.methods
      .dWithdraw(new anchor.BN(BnNumber))
      .accounts({
        mainAccount: mainAccount,
        infoAccount: infoAccount,
        delegatedAccount: delegatedAccount,
        vault: vault,
        mint: mint,
        receiptTokenAccount: senderTokenAccount,
        owner: walletPublicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();
    return {
      code: "success",
      msg: txSignatureAll,
    };
  } catch (err) {
    return {
      code: "error",
      msg: err,
    };
  }
}
