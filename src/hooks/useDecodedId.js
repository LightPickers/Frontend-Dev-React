import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function useDecodedId() {
  const token = useSelector(state => state.auth?.token);

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const { id } = jwtDecode(token);
      return id;
    } catch (useDecodedIdError) {
      console.error({ useDecodedIdError });
      return null;
    }
  }, [token]);

  return userId;
}

export default useDecodedId;
