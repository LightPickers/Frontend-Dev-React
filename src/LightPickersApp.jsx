import { Outlet } from "react-router-dom";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import DemoRegister from "@/DemoRegister";
import StyleSettings from "@/layouts/StyleSettings";

function LightPickersApp() {
  return (
    <>
      <Header />
      <Outlet />
      <StyleSettings />
      <DemoRegister />
      <Footer />
    </>
  );
}

export default LightPickersApp;
