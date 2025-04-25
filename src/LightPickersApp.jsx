import { Outlet } from "react-router-dom";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

function LightPickersApp() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default LightPickersApp;
