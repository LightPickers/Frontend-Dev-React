import React from "react";
import { HashLoader } from "react-spinners";
import { bool, node, number, string } from "prop-types";
import { useSelector } from "react-redux";

import { selectLoading, selectLoadingText } from "@/features/loading/loadingSlice";

const GlobalLoader = () => {
  const isLoading = useSelector(selectLoading);
  const loadingText = useSelector(selectLoadingText);
  if (!isLoading) return null;

  return (
    <div
      className="fixed-top top-0 start-0 vw-100 vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(139, 176, 183, 0.7)", zIndex: 9999 }}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <HashLoader
          color="#f5e6a8"
          loading={isLoading}
          size={60}
          aria-label="Loading Spinner"
          data-testid="global-loader"
        />
        <p className="mt-5 text-gray-100">{loadingText}</p>
      </div>
    </div>
  );
};

GlobalLoader.propTypes = {
  loading: bool,
  text: string,
  size: number,
  color: string,
  children: node,
};

export default GlobalLoader;
