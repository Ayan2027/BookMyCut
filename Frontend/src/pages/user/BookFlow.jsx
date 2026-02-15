import { useEffect, useState } from "react";
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
  resetBooking
} from "../../redux/booking/bookingSlice";

export default function BookFlow() {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services, slots, selectedService, selectedSlot } =
    useSelector((s) => s.booking);

  const [step, setStep] = useState(1);

  useEffect(() => {
    dispatch(fetchServicesBySalon(salonId));
    dispatch(resetBooking());
  }, [dispatch, salonId]);

  useEffect(() => {
    if (step === 2) {
      dispatch(fetchSlotsBySalon(salonId));
    }
  }, [step, dispatch, salonId]);

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

        {/* Stepper */}
        <div className="flex gap-3">
          {["Service", "Time", "Confirm"].map((label, i) => (
            <div
              key={label}
              className={`px-4 py-2 rounded-full text-sm ${
                step === i + 1
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-2xl p-6 space-y-6">

          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">Choose a Service</h2>

              <div className="grid grid-cols-3 gap-4">
                {services.map((s) => (
                  <div
                    key={s._id}
                    className={`border rounded-xl p-4 cursor-pointer ${
                      selectedService?._id === s._id
                        ? "border-black"
                        : ""
                    }`}
                    onClick={() => dispatch(setService(s))}
                  >
                    <p className="font-medium">{s.name}</p>
                    <p className="text-gray-500">₹{s.price}</p>
                  </div>
                ))}
              </div>

              <button
                disabled={!selectedService}
                className="bg-black text-white px-4 py-2 rounded"
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Choose a Time</h2>

              <div className="grid grid-cols-5 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    className={`border p-2 rounded ${
                      selectedSlot?._id === slot._id
                        ? "border-black"
                        : ""
                    }`}
                    onClick={() => dispatch(setSlot(slot))}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>

                <button
                  disabled={!selectedSlot}
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">
                Review Your Booking
              </h2>

              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Time:</strong> {selectedSlot.startTime}</p>
              <p><strong>Price:</strong> ₹{selectedService.price}</p>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>

                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={confirmBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
