import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import DemoRegister from "@/DemoRegister";
import StyleSettings from "@/layouts/StyleSettings";

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
      <StyleSettings />
      <DemoRegister />
      <Footer />
    </>
  );
}

export default LightPickersApp;
