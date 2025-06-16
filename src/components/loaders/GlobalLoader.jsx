import React from "react";
import { HashLoader } from "react-spinners";
import { bool, node, number, string } from "prop-types";

const GlobalLoader = ({
  loading = true,
  text = "載入中...",
  size = 60,
  color = "#f5e6a8",
  children = null,
}) => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* 頁面內容 */}
      {children}

      {/* 載入器 */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(139, 176, 183, 0.3)",
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
              color={color}
              loading={loading}
              size={size}
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
              {text}
            </p>
          </div>
        </div>
      )}
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
