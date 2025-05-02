import { useFormContext } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import useTaiwanDistricts from "@hooks/useTaiwanDistricts";

function TaiwanAddressSelector({ disabled = false }) {
  const { register, setValue, watch, getValues, formState } = useFormContext();
  const { data: taiwanDistricts, loading, error } = useTaiwanDistricts();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);

  const zipcode = watch("address_zipcode");
  const city = watch("address_city");
  const district = watch("address_district");

  // 根據郵遞區號查找並設定縣市和鄉鎮區
  const updateAddressByZipcode = useCallback(
    (currentZipcode, shouldMarkAsDirty = false) => {
      if (!currentZipcode || !taiwanDistricts || !Array.isArray(taiwanDistricts)) {
        console.log("無法更新地址: 缺少郵遞區號或地區資料", {
          currentZipcode,
          hasData: !!taiwanDistricts,
        });
        return false;
      }

      console.log("開始根據郵遞區號更新地址:", currentZipcode);

      // 遍歷所有縣市和鄉鎮區，查找對應的郵遞區號
      for (const cityData of taiwanDistricts) {
        if (Array.isArray(cityData.districts)) {
          const foundDistrict = cityData.districts.find(dist => dist.zip === currentZipcode);
          if (foundDistrict) {
            console.log("找到匹配:", cityData.name, foundDistrict.name);

            // 設定縣市和鄉鎮區，根據是否為初始設置來決定是否標記為 dirty
            setValue("address_city", cityData.name, {
              shouldValidate: true,
              shouldDirty: shouldMarkAsDirty,
            });

            // 需要短暫延遲設置 district，確保 city 的更新先被處理
            setTimeout(() => {
              setValue("address_district", foundDistrict.name, {
                shouldValidate: true,
                shouldDirty: shouldMarkAsDirty,
              });
              setInitialized(true);
              console.log("地址已更新完成");
            }, 50);

            return true;
          }
        }
      }

      console.log("未找到匹配的郵遞區號:", currentZipcode);
      return false;
    },
    [taiwanDistricts, setValue]
  );

  // 初始化縣市清單
  useEffect(() => {
    if (taiwanDistricts && Array.isArray(taiwanDistricts)) {
      const cityList = taiwanDistricts.map(cityData => cityData.name);
      setCities(cityList);
    }
  }, [taiwanDistricts]);

  // 根據 city 更新 district 選項
  useEffect(() => {
    if (city && taiwanDistricts && Array.isArray(taiwanDistricts)) {
      const cityData = taiwanDistricts.find(cityObj => cityObj.name === city);
      if (cityData && Array.isArray(cityData.districts)) {
        const districtList = cityData.districts.map(dist => dist.name);
        setDistricts(districtList);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [city, taiwanDistricts]);

  // 根據 district 自動設定 zipcode
  useEffect(() => {
    if (city && district && taiwanDistricts && Array.isArray(taiwanDistricts) && initialized) {
      const cityData = taiwanDistricts.find(cityObj => cityObj.name === city);
      if (cityData && Array.isArray(cityData.districts)) {
        const districtData = cityData.districts.find(dist => dist.name === district);
        if (districtData && districtData.zip && zipcode !== districtData.zip) {
          // 根據是否為初始設置決定是否標記為 dirty
          setValue("address_zipcode", districtData.zip, {
            shouldValidate: true,
            shouldDirty: !isInitialSetup, // 初始化時不標記為 dirty
          });
        }
      }
    }
  }, [city, district, setValue, taiwanDistricts, zipcode, initialized, isInitialSetup]);

  // 初始化處理：強制使用郵遞區號作為主要資料來源
  useEffect(() => {
    // 只在 taiwanDistricts 載入後執行一次初始化
    if (!initialized && taiwanDistricts && Array.isArray(taiwanDistricts)) {
      // 延遲執行初始化，確保 react-hook-form 已完成其初始值設定
      setTimeout(() => {
        const currentZipcode = getValues("address_zipcode");
        const currentCity = getValues("address_city");
        const currentDistrict = getValues("address_district");

        // 強制使用郵遞區號優先更新地址
        if (currentZipcode) {
          console.log("初始化: 發現郵遞區號", currentZipcode);
          const found = updateAddressByZipcode(currentZipcode, false); // 初始化時不標記為 dirty
          if (!found) {
            console.log("無法由郵遞區號找到對應地址，保留現有值");
            setInitialized(true);
          }
        }
        // 如果沒有郵遞區號但有縣市和鄉鎮區
        else if (currentCity && currentDistrict) {
          const cityData = taiwanDistricts.find(c => c.name === currentCity);
          if (cityData) {
            const districtData = cityData.districts.find(d => d.name === currentDistrict);
            if (districtData) {
              console.log("由縣市區域設定郵遞區號:", districtData.zip);
              setValue("address_zipcode", districtData.zip, {
                shouldValidate: true,
                shouldDirty: false, // 初始化時不標記為 dirty
              });
            }
          }
          setInitialized(true);
        } else {
          setInitialized(true);
        }

        // 初始化完成後，將 isInitialSetup 設為 false
        setTimeout(() => {
          setIsInitialSetup(false);
        }, 150);
      }, 100); // 延遲 100ms 確保表單已完全初始化
    }
  }, [taiwanDistricts, getValues, setValue, initialized, updateAddressByZipcode]);

  // 當郵遞區號變更時處理
  useEffect(() => {
    if (
      initialized &&
      zipcode &&
      taiwanDistricts &&
      Array.isArray(taiwanDistricts) &&
      !isInitialSetup
    ) {
      console.log("郵遞區號變更:", zipcode);

      const currentCity = getValues("address_city");
      const currentDistrict = getValues("address_district");
      console.log("當前地址:", { currentCity, currentDistrict, zipcode });

      // 檢查當前縣市和鄉鎮區是否與郵遞區號匹配
      let isMatched = false;

      // 只有當縣市和鄉鎮區都有值時才檢查匹配
      if (currentCity && currentDistrict) {
        const cityData = taiwanDistricts.find(c => c.name === currentCity);
        if (cityData) {
          const districtData = cityData.districts.find(d => d.name === currentDistrict);
          isMatched = districtData && districtData.zip === zipcode;

          if (isMatched) {
            console.log("目前的縣市和鄉鎮區與郵遞區號匹配");
          } else {
            console.log("目前的縣市和鄉鎮區與郵遞區號不匹配");
          }
        }
      } else {
        // 如果縣市或鄉鎮區為空，強制更新
        console.log("縣市或鄉鎮區為空，需要根據郵遞區號更新");
        isMatched = false;
      }

      // 如果不匹配，嘗試更新地址
      if (!isMatched) {
        console.log("嘗試根據郵遞區號更新地址");
        updateAddressByZipcode(zipcode, true); // 用戶交互後的更新標記為 dirty
      }
    }
  }, [zipcode, taiwanDistricts, getValues, initialized, updateAddressByZipcode, isInitialSetup]);

  // 處理載入中和錯誤狀態
  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>載入地區資料發生錯誤，請重新整理頁面。</div>;
  }

  return (
    <>
      {/* 縣市 */}
      <div className="mb-3">
        <label htmlFor="address_city" className="form-label">
          縣市
        </label>
        <select
          id="address_city"
          className="form-select"
          disabled={disabled || !taiwanDistricts}
          {...register("address_city", {
            onChange: () => {
              // 用戶選擇後立即將 isInitialSetup 設為 false
              if (isInitialSetup) setIsInitialSetup(false);
            },
          })}
        >
          <option value="">請選擇縣市</option>
          {cities.map(cityName => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </div>

      {/* 鄉鎮區 */}
      <div className="mb-3">
        <label htmlFor="address_district" className="form-label">
          鄉鎮區
        </label>
        <select
          id="address_district"
          className="form-select"
          disabled={disabled || !city || !taiwanDistricts}
          {...register("address_district", {
            onChange: () => {
              // 用戶選擇後立即將 isInitialSetup 設為 false
              if (isInitialSetup) setIsInitialSetup(false);
            },
          })}
        >
          <option value="">請選擇區域</option>
          {districts.map(distName => (
            <option key={distName} value={distName}>
              {distName}
            </option>
          ))}
        </select>
      </div>

      {/* 郵遞區號（手動輸入） */}
      <div className="mb-3">
        <label htmlFor="address_zipcode" className="form-label">
          郵遞區號
        </label>
        <input
          id="address_zipcode"
          type="text"
          className="form-control"
          {...register("address_zipcode", {
            onChange: () => {
              // 用戶輸入後立即將 isInitialSetup 設為 false
              if (isInitialSetup) setIsInitialSetup(false);
            },
          })}
          disabled
        />
      </div>
    </>
  );
}

TaiwanAddressSelector.propTypes = {
  disabled: PropTypes.bool,
};

export default TaiwanAddressSelector;
// import { useFormContext } from "react-hook-form";
// import { useEffect, useState, useCallback } from "react";
// import PropTypes from "prop-types";

// import useTaiwanDistricts from "@hooks/useTaiwanDistricts";

// function TaiwanAddressSelector({ disabled = false }) {
//   const { register, setValue, watch, getValues, formState } = useFormContext();
//   const { data: taiwanDistricts, loading, error } = useTaiwanDistricts();
//   const [cities, setCities] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [initialized, setInitialized] = useState(false);

//   const zipcode = watch("address_zipcode");
//   const city = watch("address_city");
//   const district = watch("address_district");

//   // 根據郵遞區號查找並設定縣市和鄉鎮區
//   const updateAddressByZipcode = useCallback(
//     currentZipcode => {
//       if (!currentZipcode || !taiwanDistricts || !Array.isArray(taiwanDistricts)) {
//         console.log("無法更新地址: 缺少郵遞區號或地區資料", {
//           currentZipcode,
//           hasData: !!taiwanDistricts,
//         });
//         return false;
//       }

//       console.log("開始根據郵遞區號更新地址:", currentZipcode);

//       // 遍歷所有縣市和鄉鎮區，查找對應的郵遞區號
//       for (const cityData of taiwanDistricts) {
//         if (Array.isArray(cityData.districts)) {
//           const foundDistrict = cityData.districts.find(dist => dist.zip === currentZipcode);
//           if (foundDistrict) {
//             console.log("找到匹配:", cityData.name, foundDistrict.name);

//             // 強制設定縣市和鄉鎮區，不需要依賴表單中原有的值
//             setValue("address_city", cityData.name, { shouldValidate: true, shouldDirty: true });

//             // 需要短暫延遲設置 district，確保 city 的更新先被處理
//             setTimeout(() => {
//               setValue("address_district", foundDistrict.name, {
//                 shouldValidate: true,
//                 shouldDirty: true,
//               });
//               setInitialized(true);
//               console.log("地址已更新完成");
//             }, 50);

//             return true;
//           }
//         }
//       }

//       console.log("未找到匹配的郵遞區號:", currentZipcode);
//       return false;
//     },
//     [taiwanDistricts, setValue]
//   );

//   // 初始化縣市清單
//   useEffect(() => {
//     if (taiwanDistricts && Array.isArray(taiwanDistricts)) {
//       const cityList = taiwanDistricts.map(cityData => cityData.name);
//       setCities(cityList);
//     }
//   }, [taiwanDistricts]);

//   // 根據 city 更新 district 選項
//   useEffect(() => {
//     if (city && taiwanDistricts && Array.isArray(taiwanDistricts)) {
//       const cityData = taiwanDistricts.find(cityObj => cityObj.name === city);
//       if (cityData && Array.isArray(cityData.districts)) {
//         const districtList = cityData.districts.map(dist => dist.name);
//         setDistricts(districtList);
//       } else {
//         setDistricts([]);
//       }
//     } else {
//       setDistricts([]);
//     }
//   }, [city, taiwanDistricts]);

//   // 根據 district 自動設定 zipcode
//   useEffect(() => {
//     if (city && district && taiwanDistricts && Array.isArray(taiwanDistricts) && initialized) {
//       const cityData = taiwanDistricts.find(cityObj => cityObj.name === city);
//       if (cityData && Array.isArray(cityData.districts)) {
//         const districtData = cityData.districts.find(dist => dist.name === district);
//         if (districtData && districtData.zip && zipcode !== districtData.zip) {
//           setValue("address_zipcode", districtData.zip);
//         }
//       }
//     }
//   }, [city, district, setValue, taiwanDistricts, zipcode, initialized]);

//   // 初始化處理：強制使用郵遞區號作為主要資料來源
//   useEffect(() => {
//     // 只在 taiwanDistricts 載入後執行一次初始化
//     if (!initialized && taiwanDistricts && Array.isArray(taiwanDistricts)) {
//       // 延遲執行初始化，確保 react-hook-form 已完成其初始值設定
//       setTimeout(() => {
//         const currentZipcode = getValues("address_zipcode");
//         const currentCity = getValues("address_city");
//         const currentDistrict = getValues("address_district");

//         // 強制使用郵遞區號優先更新地址
//         if (currentZipcode) {
//           console.log("初始化: 發現郵遞區號", currentZipcode);
//           const found = updateAddressByZipcode(currentZipcode);
//           if (!found) {
//             console.log("無法由郵遞區號找到對應地址，保留現有值");
//             setInitialized(true);
//           }
//         }
//         // 如果沒有郵遞區號但有縣市和鄉鎮區
//         else if (currentCity && currentDistrict) {
//           const cityData = taiwanDistricts.find(c => c.name === currentCity);
//           if (cityData) {
//             const districtData = cityData.districts.find(d => d.name === currentDistrict);
//             if (districtData) {
//               console.log("由縣市區域設定郵遞區號:", districtData.zip);
//               setValue("address_zipcode", districtData.zip);
//             }
//           }
//           setInitialized(true);
//         } else {
//           setInitialized(true);
//         }
//       }, 100); // 延遲 100ms 確保表單已完全初始化
//     }
//   }, [taiwanDistricts, getValues, setValue, initialized, updateAddressByZipcode]);

//   // 當郵遞區號變更時處理
//   useEffect(() => {
//     if (initialized && zipcode && taiwanDistricts && Array.isArray(taiwanDistricts)) {
//       console.log("郵遞區號變更:", zipcode);

//       const currentCity = getValues("address_city");
//       const currentDistrict = getValues("address_district");
//       console.log("當前地址:", { currentCity, currentDistrict, zipcode });

//       // 檢查當前縣市和鄉鎮區是否與郵遞區號匹配
//       let isMatched = false;

//       // 只有當縣市和鄉鎮區都有值時才檢查匹配
//       if (currentCity && currentDistrict) {
//         const cityData = taiwanDistricts.find(c => c.name === currentCity);
//         if (cityData) {
//           const districtData = cityData.districts.find(d => d.name === currentDistrict);
//           isMatched = districtData && districtData.zip === zipcode;

//           if (isMatched) {
//             console.log("目前的縣市和鄉鎮區與郵遞區號匹配");
//           } else {
//             console.log("目前的縣市和鄉鎮區與郵遞區號不匹配");
//           }
//         }
//       } else {
//         // 如果縣市或鄉鎮區為空，強制更新
//         console.log("縣市或鄉鎮區為空，需要根據郵遞區號更新");
//         isMatched = false;
//       }

//       // 如果不匹配，嘗試更新地址
//       if (!isMatched) {
//         console.log("嘗試根據郵遞區號更新地址");
//         updateAddressByZipcode(zipcode);
//       }
//     }
//   }, [zipcode, taiwanDistricts, getValues, initialized, updateAddressByZipcode]);

//   // 處理載入中和錯誤狀態
//   if (loading) {
//     return <div>載入中...</div>;
//   }

//   if (error) {
//     return <div>載入地區資料發生錯誤，請重新整理頁面。</div>;
//   }

//   return (
//     <>
//       {/* 縣市 */}
//       <div className="mb-3">
//         <label htmlFor="address_city" className="form-label">
//           縣市
//         </label>
//         <select
//           id="address_city"
//           className="form-select"
//           disabled={disabled || !taiwanDistricts}
//           {...register("address_city")}
//         >
//           <option value="">請選擇縣市</option>
//           {cities.map(cityName => (
//             <option key={cityName} value={cityName}>
//               {cityName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 鄉鎮區 */}
//       <div className="mb-3">
//         <label htmlFor="address_district" className="form-label">
//           鄉鎮區
//         </label>
//         <select
//           id="address_district"
//           className="form-select"
//           disabled={disabled || !city || !taiwanDistricts}
//           {...register("address_district")}
//         >
//           <option value="">請選擇區域</option>
//           {districts.map(distName => (
//             <option key={distName} value={distName}>
//               {distName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 郵遞區號（唯讀） */}
//       <div className="mb-3">
//         <label htmlFor="address_zipcode" className="form-label">
//           郵遞區號
//         </label>
//         <input
//           id="address_zipcode"
//           type="text"
//           className="form-control"
//           disabled
//           {...register("address_zipcode")}
//         />
//       </div>
//     </>
//   );
// }

// TaiwanAddressSelector.propTypes = {
//   disabled: PropTypes.bool,
// };

// export default TaiwanAddressSelector;
