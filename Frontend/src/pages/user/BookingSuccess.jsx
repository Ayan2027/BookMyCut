import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBooking } from "../../redux/booking/bookingSlice";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToBookings = () => {
    dispatch(resetBooking());
    navigate("/app/bookings");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-2xl p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold">
          Booking Confirmed
        </h1>
        <p className="text-gray-500">
          Your appointment has been scheduled successfully.
        </p>

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={goToBookings}
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}
