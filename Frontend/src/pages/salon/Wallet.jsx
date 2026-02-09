import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../../redux/wallet/walletThunks";

export default function Wallet() {
  const dispatch = useDispatch();
  const wallet = useSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Wallet</h2>
        <p className="text-gray-500">
          Track your earnings and payouts
        </p>
      </div>

      {/* BALANCE */}
      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <p className="text-gray-500">Available Balance</p>
        <p className="text-3xl font-semibold">
          ₹{wallet.balance}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Earnings"
          value={`₹${wallet.totalEarnings}`}
        />
        <StatCard
          label="Commission Paid"
          value={`₹${wallet.commissionPaid}`}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded-2xl p-6 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
