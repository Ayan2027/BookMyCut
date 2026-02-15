import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServicesBySalon,
  fetchSlotsBySalon,
  createBooking
} from "../../redux/booking/bookingThunks";
import {
  setService,
  setSlot,
  setDate,
  resetBooking
} from "../../redux/booking/bookingSlice";

export default function SalonDetails() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    services,
    slots,
    selectedService,
    selectedSlot,
    selectedDate
  } = useSelector((s) => s.booking);

  useEffect(() => {
    dispatch(resetBooking());
    dispatch(fetchServicesBySalon(salonId));
  }, [dispatch, salonId]);

  // fetch slots when date changes
  useEffect(() => {
    if (selectedService && selectedDate) {
      dispatch(
        fetchSlotsBySalon({
          salonId,
          date: selectedDate
        })
      );
    }
  }, [selectedService, selectedDate, dispatch, salonId]);

  const confirmBooking = async () => {
    await dispatch(
      createBooking({
        serviceId: selectedService._id,
        slotId: selectedSlot._id
      })
    );

    dispatch(resetBooking());
    navigate("/app/bookings/success");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        <div className="bg-white border rounded-2xl p-6">
          <h1 className="text-2xl font-semibold">
            Book Appointment
          </h1>
        </div>

        <div className="bg-white border rounded-2xl p-6 space-y-6">

          {/* Step 1: Services */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              1. Choose a Service
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {services.map((s) => (
                <div
                  key={s._id}
                  className={`border rounded-xl p-4 cursor-pointer ${
                    selectedService?._id === s._id
                      ? "border-black bg-gray-100"
                      : ""
                  }`}
                  onClick={() => {
                    dispatch(setService(s));
                    dispatch(setSlot(null));
                  }}
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="text-gray-500">₹{s.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Date */}
          {selectedService && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                2. Choose a Date
              </h2>

              <input
                type="date"
                className="border rounded p-2"
                onChange={(e) => {
                  dispatch(setDate(e.target.value));
                  dispatch(setSlot(null));
                }}
              />
            </div>
          )}

          {/* Step 3: Slots */}
          {selectedService && selectedDate && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                3. Choose a Time
              </h2>

              <div className="grid grid-cols-5 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    className={`border p-2 rounded ${
                      selectedSlot?._id === slot._id
                        ? "border-black bg-gray-100"
                        : ""
                    }`}
                    onClick={() => dispatch(setSlot(slot))}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Book button */}
          <div className="pt-4 border-t">
            <button
              disabled={
                !selectedService ||
                !selectedDate ||
                !selectedSlot
              }
              onClick={confirmBooking}
              className={`px-6 py-3 rounded text-white ${
                selectedService &&
                selectedDate &&
                selectedSlot
                  ? "bg-black"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Book and Pay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
