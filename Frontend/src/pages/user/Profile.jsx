import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import api from "../../services/api";
import { updateProfile } from "../../redux/auth/authThunks";

export default function Profile() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* Image upload handler using api.js */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploading(true);

      const res = await api.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        avatar: res.data.url,
      }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(updateProfile(form));

    if (updateProfile.fulfilled.match(result)) {
      navigate("/app/account");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-6 lg:p-12">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-black italic">EDIT PROFILE</h1>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6"
        >
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="avatar"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-violet-600 flex items-center justify-center text-2xl font-bold">
                {form.name?.[0] || "U"}
              </div>
            )}

            <label className="cursor-pointer text-sm bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 flex items-center gap-2">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-bold uppercase tracking-wider"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
