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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(139, 176, 183, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <HashLoader
          color="#f5e6a8"
          loading={isLoading}
          size={60}
          aria-label="Loading Spinner"
          data-testid="global-loader"
        />
        <p
          style={{
            marginTop: "20px",
            color: "#f2f2f2",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {loadingText}
        </p>
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
