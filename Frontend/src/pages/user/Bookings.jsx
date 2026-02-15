import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyBookings,
  updateBookingStatus
} from "../../redux/booking/bookingThunks";

export default function SalonBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <p className="text-gray-500">
          Manage customer appointments
        </p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        {loading && <p>Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-gray-500">No bookings yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              onStatus={(status) =>
                dispatch(updateBookingStatus({ id: b._id, status }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingRow({ booking, onStatus }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{booking.serviceName}</p>
        <p className="text-gray-500">{booking.date}</p>
        <p className="text-gray-500">{booking.slotTime}</p>
        <p className="text-sm">Status: {booking.status}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStatus("ACCEPTED")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Accept
        </button>

        <button
          onClick={() => onStatus("COMPLETED")}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Complete
        </button>

        <button
          onClick={() => onStatus("CANCELLED")}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
