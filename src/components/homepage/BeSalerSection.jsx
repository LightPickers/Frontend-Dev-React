import { Link } from "react-router-dom";

import { H2Primary } from "@components/Headings";

function BeSalerSection() {
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  return (
    <section
      style={{
        padding: "200px 0",
        backgroundImage: `linear-gradient(rgba(139, 176, 183, 0.2),rgba(139, 176, 183, 0.2)), url("${APP_BASE}homepage/cta/cta_bg.png")`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <main className="d-flex flex-column align-items-center justy-content-center gap-10">
          <H2Primary className="text-white">讓你的收藏，成為他人的靈光</H2Primary>
          <Link to="/login" className="btn-custom-secondary">
            註冊／登入
          </Link>
        </main>
      </div>
    </section>
  );
}

export default BeSalerSection;
