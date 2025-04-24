import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <div>404 找不到此頁面</div>
      <Link to="/">回到首頁</Link>
    </>
  );
}

export default ErrorPage;
