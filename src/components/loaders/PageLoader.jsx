import { bool, number, string } from "prop-types";
import { HashLoader } from "react-spinners";

import { useMinimumLoadingTime } from "@/hooks/useMinimunLoadingTime";
function PageLoader({ loading, text = "載入中…", minTime = 500 }) {
  const shouldShowLoading = useMinimumLoadingTime(loading, minTime);
  if (!shouldShowLoading) return null;
  return (
    <div
      className="fixed-top top-0 start-0 vw-100 vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(139, 176, 183, 0.7)", zIndex: 9999 }}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <HashLoader
          color="#f5e6a8"
          loading={shouldShowLoading}
          size={60}
          aria-label="Loading Spinner"
          data-testid="global-loader"
        />
        <p className="mt-5 text-gray-100">{text}</p>
      </div>
    </div>
  );
}
PageLoader.propTypes = {
  loading: bool,
  text: string,
  minTime: number,
};
export default PageLoader;
