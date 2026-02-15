import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServicesBySalon,
  fetchSlotsBySalon,
  createBooking
} from "../../redux/booking/bookingThunks";

import { loadRazorpay } from "../../utils/loadRazorpay";
import {
  createOrderAPI,
  verifyPaymentAPI
} from "../../services/payment.service";

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

  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");

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

  useEffect(() => {
    if (selectedService && selectedDate) {
      dispatch(fetchSlotsBySalon({ salonId, date: selectedDate }));
    }
  }, [selectedService, selectedDate, dispatch, salonId]);

  const confirmBooking = async () => {
    try {
      setProcessing(true);
      setStatusText("Creating booking...");

      const booking = await dispatch(
        createBooking({
          salonId,
          slotId: selectedSlot._id,
          services: [selectedService._id],
          bookingType: "IN_SALON"
        })
      ).unwrap();

      setStatusText("Preparing payment...");

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Payment SDK failed to load");
        setProcessing(false);
        return;
      }

      const { data } = await createOrderAPI(booking._id);
      const { order } = data;

      setStatusText("Opening payment...");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Salon Booking",
        order_id: order.id,

        handler: async function (response) {
          setStatusText("Verifying payment...");
          await verifyPaymentAPI(response);

          dispatch(resetBooking());
          navigate("/app/bookings/success");
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            setStatusText("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      setProcessing(false);
    }
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

          {/* Services */}
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

          {/* Date */}
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

          {/* Slots */}
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

          {/* Button */}
          <div className="pt-4 border-t">
            <button
              disabled={
                processing ||
                !selectedService ||
                !selectedDate ||
                !selectedSlot
              }
              onClick={confirmBooking}
              className={`px-6 py-3 rounded text-white ${
                processing
                  ? "bg-gray-500"
                  : "bg-black"
              }`}
            >
              {processing ? "Processing..." : "Book and Pay"}
            </button>

            {statusText && (
              <p className="text-sm text-gray-500 mt-2">
                {statusText}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
