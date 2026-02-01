import { useParams } from "react-router-dom";

export default function SalonDetails() {
  const { salonId } = useParams();
  return <h2>Salon Details: {salonId}</h2>;
}
