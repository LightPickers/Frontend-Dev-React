import { useEffect, useState } from "react";

import { taiwanDistricts } from "@data/taiwanDistricts";

export default function useTaiwanDistricts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(taiwanDistricts);
    setLoading(false);
  }, []);

  return { data, loading, error };
}

// 以下是從遠端取得資料的方式

// import { useEffect, useState } from "react";
// import axios from "axios";

// function useTaiwanDistricts() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchDistricts() {
//       try {
//         const res = await axios.get(
//           "https://gist.githubusercontent.com/abc873693/2804e64324eaaf26515281710e1792df/raw/taiwan_districts.json"
//         );
//         setData(res.data);
//       } catch (err) {
//         console.error("載入失敗：", err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDistricts();
//   }, []);

//   return { data, loading, error };
// }

// export default useTaiwanDistricts;
