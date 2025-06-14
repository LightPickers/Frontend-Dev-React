import classNames from "classnames";
import { string } from "prop-types";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchIcon } from "@/components/icons";

function BannerSearchBar({ text = "找尋商品…" }) {
  const [searchValue, setSearchValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = e => {
    if (hasError) setHasError(false);
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setSearchValue("");
      setHasError(true);
      inputRef.current?.focus();
      return;
    }
    navigate(`/products?keyword=${searchValue.trim()}`);
    setSearchValue("");
    setHasError(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={classNames("search-input-group", { "is-invalid": hasError })}>
      <input
        type="text"
        ref={inputRef}
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (hasError) setHasError(false);
        }}
        placeholder={!hasError ? text : "請輸入關鍵字"}
        className={classNames("search-input", "form-control", {
          "is-invalid": hasError,
        })}
        aria-label="Search"
      />
      <button
        className="search-btn btn btn-link"
        type="button"
        onClick={handleSearch}
        disabled={!searchValue.trim()}
      >
        <SearchIcon title="搜尋商品" className={classNames({ "is-invalid": hasError })} />
      </button>
    </div>
  );
}
BannerSearchBar.propTypes = {
  text: string,
};
export default BannerSearchBar;
