import { useState } from "react";
import API from "../../services/api";

const Hairstyle = () => {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // convert image → base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
    });
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);

    try {
      const base64 = await convertToBase64(file);

      const res = await API.post("/ai/analyze", {
        image: base64,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="ai-container">
      <h2>AI Hairstyle Suggestion</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {/* Preview */}
      {preview && (
        <img src={preview} alt="preview" className="preview" />
      )}

      {/* Loading */}
      {loading && <p>Analyzing...</p>}

      {/* Result */}
      {result && (
        <div className="result">
          <h3>Face Shape: {result.faceShape}</h3>

          {result.hairstyles.map((style, i) => (
            <div key={i} className="card">
              <strong>{style.name}</strong>
              <p>{style.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hairstyle;