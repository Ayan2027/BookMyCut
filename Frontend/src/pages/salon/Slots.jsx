import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMySlots,
  generateSlots,
  deleteSlot
} from "../../redux/slot/slotThunks";

export default function Slots() {
  const dispatch = useDispatch();
  const { list } = useSelector(s => s.slot);

  const [form, setForm] = useState({
    date: "",
    start: "09:00",
    end: "18:00",
    interval: 30
  });

  useEffect(() => {
    dispatch(fetchMySlots());
  }, []);

  return (
    <div>
      <h2>Generate Slots</h2>

      <input type="date" onChange={e => setForm({ ...form, date: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, start: e.target.value })} />
      <input type="time" onChange={e => setForm({ ...form, end: e.target.value })} />
      <input type="number" placeholder="Interval (mins)" onChange={e => setForm({ ...form, interval: e.target.value })} />

      <button onClick={() => dispatch(generateSlots(form))}>
        Generate
      </button>

      <ul>
        {list.map(slot => (
          <li key={slot._id}>
            {slot.time}
            <button onClick={() => dispatch(deleteSlot(slot._id))}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
