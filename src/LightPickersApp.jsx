import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
import ScrollToTop from "@components/ScrollToTop";
import { selectLoading } from "@/features/loading/loadingSlice";
import GlobalLoader from "@/components/loaders/GlobalLoader";

function LightPickersApp() {
  const isLoading = useSelector(selectLoading);
  // const dispatch = useDispatch();
  // const location = useLocation();

  // useEffect(() => {
  //   dispatch(showLoading());
  //   const timer = setTimeout(() => {
  //     dispatch(hideLoading());
  //   }, 800);

  //   return () => clearTimeout(timer);
  // }, [dispatch, location]);

  return (
    <>
      {isLoading && <GlobalLoader />}
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default LightPickersApp;
