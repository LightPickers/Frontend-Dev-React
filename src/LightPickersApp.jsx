import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import StyleSettings from "@/layouts/StyleSettings";
import { useVerifyAuthQuery } from "@features/users/userApi";
import { logout, setCredentials } from "@features/auth/authSlice";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LightPickersApp() {
  // const dispatch = useDispatch();
  // const { data, error, isSuccess } = useVerifyAuthQuery();

  // useEffect(() => {
  //   if (isSuccess && data?.user) {
  //     dispatch(setCredentials({ user: data.user, token: null }));
  //   } else if (error) {
  //     dispatch(logout());
  //   }
  // }, [isSuccess, error, data, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      {/* <StyleSettings /> */}
      <Footer />
    </>
  );
}

export default LightPickersApp;
