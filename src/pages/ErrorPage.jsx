import { Link } from "react-router-dom";

import { H1Primary } from "@/components/Headings";

function ErrorPage() {
  return (
    <>
      <H1Primary>404 找不到此頁面</H1Primary>
      <Link to="/">回到首頁</Link>
    </>
  );
}

export default ErrorPage;
