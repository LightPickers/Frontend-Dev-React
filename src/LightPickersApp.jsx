import { Outlet } from "react-router-dom";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import ScrollToTop from "@components/ScrollToTop";

function LightPickersApp() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default LightPickersApp;
