import React from "react";
import ReactDOM from "react-dom/client";
import "@assets/all.scss";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import appRouter from "@routes/router";
import store from "@/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
      <ToastContainer position="top-center" autoClose={3000} />
    </Provider>
  </React.StrictMode>
);
