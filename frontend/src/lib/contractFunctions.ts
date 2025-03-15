import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { PROGRAM_ID, VAULT_PDA_SEED } from "@/config";
import idl from "@/idl.json";


const network = "https://api.devnet.solana.com"; // Use "http://127.0.0.1:8899" for localnet
const connection = new Connection(network, "confirmed");

// Function to get Anchor Provider
const getProvider = (wallet: any) => {
  return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
};

// Function to get the program instance
const getProgram = (wallet: any) => {
  const provider = getProvider(wallet);
  return new Program(idl, PROGRAM_ID, provider);
};

// **Deposit Function**
export async function handleDeposit(wallet: any) {
  if (!wallet.publicKey) {
    alert("Connect your wallet first!");
    return;
  }

  const program = getProgram(wallet);
  const [vaultPda] = PublicKey.findProgramAddressSync([Buffer.from(VAULT_PDA_SEED)], PROGRAM_ID);

  try {
    const tx = await program.methods.deposit().accounts({
      user: wallet.publicKey,
      vault: vaultPda,
      systemProgram: SystemProgram.programId,
    }).rpc();

    console.log("Deposit successful:", tx);
  } catch (error) {
    console.error("Deposit failed:", error);
  }
}

// **Withdraw Function**
export async function handleWithdraw(wallet: any) {
  if (!wallet.publicKey) {
    alert("Connect your wallet first!");
    return;
  }

  const program = getProgram(wallet);
  const [vaultPda] = PublicKey.findProgramAddressSync([Buffer.from(VAULT_PDA_SEED)], PROGRAM_ID);

  try {
    const tx = await program.methods.withdraw().accounts({
      user: wallet.publicKey,
      vault: vaultPda,
    }).rpc();

    console.log("Withdraw successful:", tx);
  } catch (error) {
    console.error("Withdraw failed:", error);
  }
}
