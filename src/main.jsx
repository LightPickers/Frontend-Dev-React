import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/all.scss";
import { RouterProvider } from "react-router-dom";
import appRouter from "./routes/router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);
