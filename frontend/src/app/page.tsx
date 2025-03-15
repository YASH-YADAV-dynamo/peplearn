import WalletButton from "@/components/WalletButton";
import DepositButton from "@/components/DepositButton";
import WithdrawButton from "@/components/WithdrawButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Solana Reward DApp</h1>

      {/* Wallet Connection */}
      <WalletButton />

      {/* Deposit & Withdraw Buttons */}
      <div className="flex gap-4 mt-6">
        <DepositButton />
        <WithdrawButton />
      </div>
    </main>
  );
}
