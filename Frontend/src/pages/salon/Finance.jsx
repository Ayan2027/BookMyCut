import { useEffect, useState } from "react";
import api from "../../services/api"; // ✅ use your axios instance

export default function SalonFinance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await api.get("/salons/finance"); // ✅ IMPORTANT
        console.log("res of finance ",res.data)
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load finance data");
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, []);

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-8">

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Total Earned" value={data.totalEarnings} />
        <Card label="Total Paid" value={data.totalPaid} />
        <Card label="Balance" value={data.balance} />
      </div>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th>Earned</th>
              <th>Paid</th>
              <th>Remaining</th>
            </tr>
          </thead>

          <tbody>
            {data.daily?.length > 0 ? (
              data.daily.map((d, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="p-3">{formatDate(d.date)}</td>
                  <td>₹{d.earned}</td>
                  <td>₹{d.paid}</td>
                  <td
                    className={
                      d.remaining > 0 ? "text-amber-400" : "text-green-400"
                    }
                  >
                    ₹{d.remaining}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-zinc-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* SMALL COMPONENT */
function Card({ label, value }) {
  return (
    <div className="bg-[#080808] p-6 rounded-xl border border-white/5">
      <div className="text-xs text-zinc-500 uppercase">{label}</div>
      <div className="text-xl font-bold">₹{value}</div>
    </div>
  );
}

/* DATE FORMATTER */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN"); // India format
}