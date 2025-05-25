import React from "react";
import ReactDOM from "react-dom/client";
import "@assets/all.scss";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "@/store";
import appRouter from "@routes/router";
import { AuthProvider } from "@components/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthProvider>
          <RouterProvider router={appRouter} />
          <ToastContainer position="bottom-center" autoClose={3000} />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
