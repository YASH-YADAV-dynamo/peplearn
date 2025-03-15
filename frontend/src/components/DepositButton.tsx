"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { handleDeposit } from "@/lib/contractFunctions";

export default function DepositButton() {
  const wallet = useWallet();

  return (
    <button
      onClick={() => handleDeposit(wallet)}
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
    >
      Deposit 0.05 SOL
    </button>
  );
}
