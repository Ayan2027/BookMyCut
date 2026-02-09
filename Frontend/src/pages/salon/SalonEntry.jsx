import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMySalon } from "../../redux/salon/salonThunks";

export default function SalonEntry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { exists, status, loading } = useSelector((s) => s.salon);

  useEffect(() => {
    dispatch(fetchMySalon());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!exists) {
      navigate("/salon/apply", { replace: true });
      return;
    }

    if (status === "APPROVED") {
      navigate("/salon/dashboard", { replace: true });
      return;
    }

    if (
      status === "PENDING" ||
      status === "REJECTED" ||
      status === "SUSPENDED"
    ) {
      navigate("/salon/application-status", { replace: true });
    }
  }, [exists, status, loading, navigate]);

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-[320px]">
        <h2 className="text-xl font-semibold mb-2">
          Checking salon status
        </h2>
        <p className="text-gray-500 mb-4">
          Please wait while we load your dashboard
        </p>

        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" />
      </div>
    </div>
  );
}
