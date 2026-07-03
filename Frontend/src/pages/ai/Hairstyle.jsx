import { useState, useRef, useEffect } from "react";
import API from "../../services/api";

const Hairstyle = () => {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [recommendedAt, setRecommendedAt] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  // load last saved recommendation on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await API.get("/ai/latest");
        if (res.data) {
          setResult({
            faceShape: res.data.faceShape,
            hairstyles: res.data.hairstyles
          });
          setRecommendedAt(res.data.recommendedAt);
        }
      } catch (err) {
        console.error("Failed to load latest recommendation:", err);
      } finally {
        setLoadingLatest(false);
      }
    };
    fetchLatest();
    return () => stopCamera();
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });
  };

  const analyze = async (base64) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/ai/analyze", { image: base64 });
      setResult(res.data);
      setRecommendedAt(new Date().toISOString());
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const base64 = await convertToBase64(file);
    analyze(base64);
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please allow permission or use upload instead.");
      setCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      setPreview(URL.createObjectURL(blob));
      stopCamera();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        analyze(base64);
      };
    }, "image/jpeg", 0.9);
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setRecommendedAt(null);
    stopCamera();
  };

  return (
    <div className="ai-container">
      <h2 className="ai-title">AI Hairstyle Suggestion</h2>
      <p className="ai-subtitle">
        Upload a photo or use your camera to get hairstyle recommendations tailored to your face shape.
      </p>

      {!preview && !cameraActive && (
        <div className="upload-options">
          <label className="upload-tile">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files[0])}
              hidden
            />
            <span className="upload-icon">📁</span>
            <span>Upload Photo</span>
          </label>

          <button className="upload-tile camera-tile" onClick={startCamera}>
            <span className="upload-icon">📷</span>
            <span>Use Camera</span>
          </button>
        </div>
      )}

      {cameraActive && (
        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline className="camera-preview" />
          <div className="camera-controls">
            <button className="btn-primary" onClick={captureSnapshot}>Capture</button>
            <button className="btn-secondary" onClick={stopCamera}>Cancel</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {preview && (
        <div className="preview-box">
          <img src={preview} alt="preview" className="preview" />
          <button className="btn-secondary" onClick={handleReset}>Try another photo</button>
        </div>
      )}

      {(loading || loadingLatest) && (
        <div className="ai-loading">
          <span className="spinner" />
          <p>{loading ? "Analyzing your face..." : "Loading your last result..."}</p>
        </div>
      )}

      {result && !loading && (
        <div className="result">
          <div className="result-header">
            <h3>
              Face Shape: <span className="face-shape-badge">{result.faceShape}</span>
            </h3>
            {recommendedAt && (
              <span className="result-timestamp">
                Last generated {new Date(recommendedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="cards-grid">
            {result.hairstyles.map((style, i) => (
              <div key={i} className="card">
                <strong>{style.name}</strong>
                <p>{style.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hairstyle;