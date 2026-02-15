import { useNavigate, useParams } from "react-router-dom";

export default function SalonDetails() {
  const { salonId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Salon</h1>
      <p className="text-gray-500">
        View services and book an appointment.
      </p>

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => navigate(`/app/salons/${salonId}/services`)}
      >
        View Services
      </button>
    </div>
  );
}
