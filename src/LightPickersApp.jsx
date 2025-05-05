import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
