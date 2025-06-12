import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchIcon } from "@components/icons";
import useOutsideClick from "@hooks/useOutsideClick";

function NavSearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  // 處理搜尋框開合
  const handleCollapse = () => {
    setIsExpanded(false);
    setHasError(false);
  };

  const searchRef = useOutsideClick(handleCollapse);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // 處理輸入的值 & 搜尋
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
    setIsExpanded(false);
    setHasError(false);
  };

  // 處理使用 enter 輸入
  const handleKeyDown = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <section ref={searchRef} className={`expanding-search ${isExpanded ? "expanded" : ""}`}>
        <div className={`search-container ${hasError ? "is-invalid" : ""}`}>
          <input
            type="text"
            ref={inputRef}
            placeholder={!hasError ? "搜尋商品" : "請輸入關鍵字"}
            className={`form-control search-input ${isExpanded ? "show" : "hide"} ${hasError ? "is-invalid" : ""}`}
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            // autoFocus={isExpanded}
          />
        </div>
        <button
          // p-xl-3 p-lg-2
          onClick={isExpanded ? handleSearch : handleToggle}
          className={`btn fw-bold shadow-none p-3 search-button ${isExpanded ? "search-mode" : "icon-mode"} ${hasError ? "is-invalid" : ""}`}
          disabled={isExpanded && !searchValue.trim()}
        >
          <SearchIcon title="搜尋商品" className={`${hasError ? "is-invalid" : ""}`} />
        </button>
      </section>
    </>
  );
}

export default NavSearchBar;
