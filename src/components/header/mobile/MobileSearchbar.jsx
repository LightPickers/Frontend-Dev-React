import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bool, func, string } from "prop-types";
import classNames from "classnames";

import { SearchIcon } from "@/components/icons";

function MobileSearchbar({ isMenuOpen, closeMenu }) {
  const [searchValue, setSearchValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // 開啟漢堡選單時對焦搜尋框
    if (isMenuOpen && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeout);
    }
    // 關閉時清空搜尋框
    if (!isMenuOpen) setSearchValue("");
  }, [isMenuOpen]);

  // 處理搜尋框輸入的值
  const handleInputChange = e => {
    if (hasError) setHasError(false);
    setSearchValue(e.target.value);
  };

  // 處理搜尋功能
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
    closeMenu();
  };

  // 處理 Enter 搜尋（Enter 大小寫敏感）
  const handleKeyDown = e => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <section className="mobile-searchbar">
      <div className={classNames("searchbar-container", { "is-invalid": hasError })}>
        <input
          type="text"
          ref={inputRef}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={!hasError ? "搜尋商品" : "請輸入關鍵字"}
          className={classNames(
            "search-input",
            "form-control",
            "py-sm-5",
            "py-3",
            "px-sm-6",
            "px-5",
            {
              "is-invalid": hasError,
            }
          )}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="btn btn-link search-button"
          disabled={isMenuOpen && !searchValue.trim()}
        >
          <SearchIcon className={classNames({ "is-invalid": hasError })} title="搜尋商品" />
        </button>
      </div>
    </section>
  );
}

MobileSearchbar.propTypes = {
  isMenuOpen: bool.isRequired,
  closeMenu: func.isRequired,
};

export default MobileSearchbar;
