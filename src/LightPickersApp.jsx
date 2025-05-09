import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import { userApi } from "@/features/users/userApi";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LightPickersApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userApi.endpoints.verifyAuth.initiate());
  }, [dispatch]);

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
