import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "./redux/auth/authThunks";
import Router from "./router";
import { storage } from "./utils/storage";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (storage.getToken()) {
      dispatch(hydrateAuth());
    }
  }, []);

  return <Router />;
}
