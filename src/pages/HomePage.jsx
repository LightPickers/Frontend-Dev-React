// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HomePage() {
  // const userId = useSelector(state => state.auth.user?.id);
  // console.log(userId);
  return (
    <>
      {/* <BtnPrimary>進入會員中心</BtnPrimary> */}
      <div className="container">
        <Link className="text-sans text-m d-block" to="/account/profile/settings">
          進入會員中心（驗證登入）
        </Link>
        <Link className="text-sans text-m d-block" to="/register">
          註冊
        </Link>
      </div>
    </>
  );
}

export default HomePage;
