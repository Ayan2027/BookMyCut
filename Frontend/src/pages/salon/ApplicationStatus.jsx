import { useSelector } from "react-redux";

export default function ApplicationStatus() {
  const { status, salon } = useSelector((s) => s.salon);

  if (status === "PENDING") {
    return (
      <div>
        <h2>Application Pending</h2>
        <p>Your salon is under review.</p>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div>
        <h2>Application Rejected</h2>
        <p>Reason: {salon?.rejectionReason || "Not provided"}</p>
      </div>
    );
  }

  return null;
}
