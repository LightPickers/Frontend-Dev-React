import React from "react";
import { useSelector } from "react-redux";
import { any } from "prop-types";

import { selectLoading, selectLoadingText } from "@features/loading/loadingSlice";
import GlobalLoader from "@components/loaders/GlobalLoader";

const GlobalLoadingWrapper = ({ children }) => {
  const isLoading = useSelector(selectLoading);
  const loadingText = useSelector(selectLoadingText);

  return (
    <GlobalLoader loading={isLoading} text={loadingText}>
      {children}
    </GlobalLoader>
  );
};

GlobalLoadingWrapper.propTypes = {
  children: any,
};

export default GlobalLoadingWrapper;
