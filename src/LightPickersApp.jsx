import { Outlet } from "react-router-dom";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";

import DemoRegister from "@/DemoRegister";

function LightPickersApp() {
  return (
    <>
      <Header />
      <DemoRegister />
      <Outlet />
      <Footer />
    </>
  );
}

export default LightPickersApp;
