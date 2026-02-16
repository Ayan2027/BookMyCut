import { useState } from "react";
import { useDispatch } from "react-redux";
import { applySalon } from "../../redux/salon/salonThunks";
import axios from "axios";

export default function Apply() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    mapLink: "",
  });

  const [imageUrl, setImageUrl] = useState("");

  // image upload
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);

    const res = await axios.post("http://localhost:4000/upload", data);
    setImageUrl(res.data.url);
  };

  // map link validation
  const isValidMapLink = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;

      return (
        host.includes("google.com") ||
        host.includes("goo.gl") ||
        host.includes("maps.app.goo.gl")
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidMapLink(form.mapLink)) {
      alert("Please enter a valid Google Maps link");
      return;
    }
    console.log("hrree")
    await dispatch(
      applySalon({
        ...form,
        image: imageUrl,
      }),
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Apply for Salon</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          placeholder="Salon name"
          className="w-full border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          placeholder="Address"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <input
          placeholder="City"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
        />

        {/* Map link input */}
        <div>
          <input
            placeholder="Paste Google Maps link (e.g. https://maps.google.com/?q=25.43,81.84)"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                mapLink: e.target.value,
              })
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Open Google Maps → search your salon → tap “Share” → copy link.
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline"
          >
            Open Google Maps
          </a>
        </div>

        {/* Image picker */}
        <div>
          <label className="block mb-2">Salon Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0])}
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="w-40 h-40 object-cover mt-3 rounded"
            />
          )}
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
}
