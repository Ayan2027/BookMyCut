import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.salon);

  useEffect(() => {
    if (status === "APPROVED") {
      navigate("/salon/dashboard");
    }
  }, [status, navigate]);

  const renderMessage = () => {
    if (status === "PENDING") {
      return {
        title: "Application Under Review",
        desc: "Our team is verifying your salon details. This usually takes 24–48 hours."
      };
    }

    if (status === "REJECTED") {
      return {
        title: "Application Rejected",
        desc: "Your application was rejected. Please update your details and reapply."
      };
    }

    if (status === "SUSPENDED") {
      return {
        title: "Salon Suspended",
        desc: "Your salon account has been suspended. Contact support for assistance."
      };
    }

    return {
      title: "Loading",
      desc: "Checking status..."
    };
  };

  const msg = renderMessage();

  return (
    <div className="flex justify-center py-20">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[420px] text-center">
        <h2 className="text-2xl font-semibold mb-4">{msg.title}</h2>
        <p className="text-gray-600">{msg.desc}</p>

        {status === "PENDING" && (
          <div className="mt-6 animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
        )}
      </div>
    </div>
  );
}
