import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyBookings,
  updateBookingStatus
} from "../../redux/booking/bookingThunks";

export default function UserBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">My Bookings</h2>
        <p className="text-gray-500">
          Track your appointments and status
        </p>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-2xl p-6">
        {loading && <p>Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-gray-500">No bookings yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onCancel={() =>
                dispatch(
                  updateBookingStatus({
                    id: b._id,
                    status: "CANCELLED"
                  })
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const statusText = {
  PENDING: "Waiting for salon confirmation",
  ACCEPTED: "Appointment confirmed",
  COMPLETED: "Service completed",
  CANCELLED: "Booking cancelled"
};

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700"
};

function BookingCard({ booking, onCancel }) {
  const canCancel = booking.status === "PENDING";

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div className="space-y-1">
        <div className="flex gap-2 items-center">
          <p className="font-semibold">
            {booking.services?.map((s) => s.name).join(", ")}
          </p>

          <span
            className={`text-xs px-2 py-1 rounded ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          {booking.slot?.date}
        </p>

        <p className="text-gray-500 text-sm">
          {booking.slot?.startTime}
        </p>

        <p className="text-sm font-medium">
          ₹{booking.totalAmount}
        </p>

        <p className="text-xs text-gray-500">
          {statusText[booking.status]}
        </p>
      </div>

      {canCancel && (
        <button
          onClick={onCancel}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Cancel booking
        </button>
      )}
    </div>
  );
}
