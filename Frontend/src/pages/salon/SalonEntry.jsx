import { useSelector } from "react-redux";
import Apply from "./Apply";
import ApplicationStatus from "./ApplicationStatus";
import Dashboard from "./Dashboard";

export default function SalonEntry() {
  const { exists, status, loading } = useSelector((s) => s.salon);
  console.log(exists);
  console.log(status);

  if (loading) return <div>Loading salon data...</div>;

  // No application yet
  if (!exists) {
    return <Apply />;
  }

  if (status === "PENDING") {
    return <ApplicationStatus />;
  }

  if (status === "APPROVED") {
    return <Dashboard />;
  }
  if(status === "SUSPENDED"){
    return(
      <>
       <div>your salon is suspended</div>
      </>
    )
  }

  return <div>Unknown salon state</div>;
}
