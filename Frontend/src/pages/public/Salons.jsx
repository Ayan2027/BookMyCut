import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalons } from "../../redux/salon/salonThunks";
import { useNavigate } from "react-router-dom";

export default function Salons() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { salons, loading } = useSelector((s) => s.salon);

  useEffect(() => {
    dispatch(fetchSalons());
  }, [dispatch]);

  if (loading) {
    return <div className="p-6">Loading salons...</div>;
  }

  if (!salons?.length) {
    return <div className="p-6">No salons available</div>;
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {salons.map((s) => (
        <div
          key={s._id}
          className="border rounded-xl p-4 cursor-pointer"
          onClick={() => navigate(`/app/salons/${s._id}`)}
        >
          <h3 className="font-semibold">{s.name}</h3>
          <p className="text-gray-500">{s.city}</p>
        </div>
      ))}
    </div>
  );
}
