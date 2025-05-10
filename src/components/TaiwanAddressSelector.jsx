import { useFormContext } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import useTaiwanDistricts from "@hooks/useTaiwanDistricts";

function TaiwanAddressSelector({ disabled = false, errors }) {
  const { register, setValue, watch, getValues, formState } = useFormContext();
  const { data: taiwanDistricts, loading, error } = useTaiwanDistricts();

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const zipcode = watch("address_zipcode");
  const city = watch("address_city");
  const district = watch("address_district");

  const updateAddressByZipcode = useCallback(
    (zip, shouldDirty = false) => {
      if (!zip || !taiwanDistricts) return false;

      for (const cityData of taiwanDistricts) {
        const found = cityData.districts.find(d => d.zip === zip);
        if (found) {
          setValue("address_city", cityData.name, {
            shouldValidate: true,
            shouldDirty,
          });

          Promise.resolve().then(() => {
            setValue("address_district", found.name, {
              shouldValidate: true,
              shouldDirty,
            });
            setInitialized(true);
          });
          return true;
        }
      }
      return false;
    },
    [taiwanDistricts, setValue]
  );

  useEffect(() => {
    if (taiwanDistricts) {
      setCities(taiwanDistricts.map(c => c.name));
    }
  }, [taiwanDistricts]);

  useEffect(() => {
    if (!city || !taiwanDistricts) return;

    const cityData = taiwanDistricts.find(c => c.name === city);
    if (!cityData) {
      setDistricts([]);
      return;
    }

    const availableDistricts = cityData.districts.map(d => d.name);
    setDistricts(availableDistricts);

    const currentDistrict = getValues("address_district");
    if (currentDistrict && !availableDistricts.includes(currentDistrict)) {
      setValue("address_district", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [city, taiwanDistricts, setValue, getValues]);

  useEffect(() => {
    if (!initialized || !city || !district || !taiwanDistricts) return;

    const cityData = taiwanDistricts.find(c => c.name === city);
    if (!cityData) return;

    const districtData = cityData.districts.find(d => d.name === district);
    if (districtData && zipcode !== districtData.zip) {
      setValue("address_zipcode", districtData.zip, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [city, district, zipcode, taiwanDistricts, setValue, initialized]);

  useEffect(() => {
    if (initialized || !taiwanDistricts) return;

    const currentZip = getValues("address_zipcode");
    const currentCity = getValues("address_city");
    const currentDistrict = getValues("address_district");

    if (currentZip) {
      updateAddressByZipcode(currentZip, false);
    } else if (currentCity && currentDistrict) {
      const cityData = taiwanDistricts.find(c => c.name === currentCity);
      const districtData = cityData?.districts.find(d => d.name === currentDistrict);
      if (districtData) {
        setValue("address_zipcode", districtData.zip, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
      setInitialized(true);
    } else {
      setInitialized(true);
    }
  }, [taiwanDistricts, initialized, getValues, setValue, updateAddressByZipcode]);

  useEffect(() => {
    if (!initialized || !zipcode || !taiwanDistricts) return;

    const currentCity = getValues("address_city");
    const currentDistrict = getValues("address_district");

    const cityData = taiwanDistricts.find(c => c.name === currentCity);
    const matched = cityData?.districts.find(d => d.name === currentDistrict && d.zip === zipcode);

    if (!matched) {
      updateAddressByZipcode(zipcode, true);
    }
  }, [zipcode, taiwanDistricts, initialized, getValues, updateAddressByZipcode]);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>載入地區資料發生錯誤，請重新整理頁面。</div>;

  return (
    <>
      {/* 縣市 */}
      <div className="mb-3">
        <label htmlFor="address_city" className="form-label required">
          縣市
        </label>
        <select
          id="address_city"
          className={`form-select ${errors.address_zipcode ? "is-invalid" : ""}`}
          disabled={disabled || !taiwanDistricts}
          {...register("address_city")}
        >
          <option value="" disabled>
            請選擇縣市
          </option>
          {cities.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.address_city && (
          <div className="invalid-feedback">{errors.address_city.message}</div>
        )}
      </div>

      {/* 區域 */}
      <div className="mb-3">
        <label htmlFor="address_district" className="form-label required">
          鄉鎮區
        </label>
        <select
          id="address_district"
          className={`form-select ${errors.address_zipcode ? "is-invalid" : ""}`}
          disabled={disabled || !city}
          {...register("address_district")}
        >
          <option value="" disabled>
            請選擇區域
          </option>
          {districts.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.address_district && (
          <div className="invalid-feedback">{errors.address_district.message}</div>
        )}
      </div>

      {/* 郵遞區號 */}
      <div className="mb-3">
        <label htmlFor="address_zipcode" className="form-label required">
          郵遞區號
        </label>
        <input
          id="address_zipcode"
          type="text"
          className={`form-control ${errors.address_zipcode ? "is-invalid" : ""}`}
          {...register("address_zipcode")}
          disabled
        />
        {errors.address_zipcode && (
          <div className="invalid-feedback">{errors.address_zipcode.message}</div>
        )}
      </div>
    </>
  );
}

TaiwanAddressSelector.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
};

export default TaiwanAddressSelector;
