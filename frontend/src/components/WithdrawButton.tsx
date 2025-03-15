"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { handleWithdraw } from "@/lib/contractFunctions";

export default function WithdrawButton() {
  const wallet = useWallet();

  return (
    <button
      onClick={() => handleWithdraw(wallet)}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Withdraw 0.05 SOL
    </button>
  );
}
