import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "./redux/auth/authThunks";
import Router from "./router";
import { storage } from "./utils/storage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (storage.getToken()) {
      dispatch(hydrateAuth());
    }
  }, [dispatch]);

  return (
    <>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
