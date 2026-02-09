import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyServices,
  createService,
  deleteService
} from "../../redux/service/serviceThunks";

export default function Services() {
  const dispatch = useDispatch();
  const { list } = useSelector(s => s.service);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: ""
  });

  useEffect(() => {
    dispatch(fetchMyServices());
  }, []);

  return (
    <div>
      <h2>My Services</h2>

      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Duration (mins)" onChange={e => setForm({ ...form, duration: e.target.value })} />

      <button onClick={() => dispatch(createService(form))}>
        Add Service
      </button>

      <ul>
        {list.map(s => (
          <li key={s._id}>
            {s.name} — ₹{s.price} — {s.duration}min
            <button onClick={() => dispatch(deleteService(s._id))}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
