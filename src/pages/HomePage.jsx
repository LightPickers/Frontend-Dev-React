import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import BtnPrimary from "@/components/Button";
import { getAccountSettingsPath } from "@/routes/helpers";
function HomePage() {
  const userId = useSelector(state => state.auth.user?.id);
  console.log(userId);
  return (
    <>
      {/* <BtnPrimary>進入會員中心</BtnPrimary> */}
      <Link to={getAccountSettingsPath(userId)}>進入會員中心</Link>
    </>
  );
}

export default HomePage;
