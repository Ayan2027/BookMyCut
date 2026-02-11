import { useState } from "react";
import { useDispatch } from "react-redux";
import { applySalon, fetchMySalon } from "../../redux/salon/salonThunks";

export default function Apply() {
  const dispatch = useDispatch();

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
    dispatch(fetchMySalon());
  };

  return (
    <div>
      <h2>Apply as a Salon</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Salon Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
