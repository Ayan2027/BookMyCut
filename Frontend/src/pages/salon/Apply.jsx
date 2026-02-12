import { useState } from "react";
import { useDispatch } from "react-redux";
import { applySalon, fetchMySalon } from "../../redux/salon/salonThunks";
import { useNavigate } from "react-router-dom";

export default function Apply() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(applySalon(form));
    await dispatch(fetchMySalon());
    navigate("/salon");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl rounded-3xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-black">
            Apply as a Salon
          </h2>
          <p className="text-gray-500 mt-2">
            Register your salon and start receiving bookings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Salon Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salon Name
            </label>
            <input
              name="name"
              placeholder="e.g. Classic Cuts"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              name="address"
              placeholder="Street, Area, City"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
          >
            Submit Application
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Your application will be reviewed by the admin.
        </p>
      </div>
    </div>
  );
}
