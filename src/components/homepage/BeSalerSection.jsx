import { Link } from "react-router-dom";

import { H2Primary } from "@components/Headings";
import useBreakpoint from "@/hooks/useBreakpoints";

const APP_BASE = import.meta.env.VITE_APP_BASE;
const CTA_PIC_BASE = `${APP_BASE}homepage/cta`;
const BACKGROUND_GRADIENT = "linear-gradient(rgba(139, 176, 183, 0.2),rgba(139, 176, 183, 0.2))";

function BeSalerSection() {
  const isMdUp = useBreakpoint("mdUp");
  const isSmUp = useBreakpoint("sm");
  const backgroundImageUrl = isMdUp
    ? `${CTA_PIC_BASE}/cta_bg.png`
    : `${CTA_PIC_BASE}/cta_bg-sm.png`;
  return (
    <section
      className="py-md-50 py-30"
      style={{
        backgroundImage: `${BACKGROUND_GRADIENT}, url("${backgroundImageUrl}`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <main className="d-flex flex-column align-items-center justy-content-center gap-10">
          {isSmUp ? (
            <H2Primary className="text-white text-balance text-center">
              讓你的收藏，成為他人的靈光
            </H2Primary>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-between gap-3 text-white">
              <H2Primary>讓你的收藏</H2Primary>
              <H2Primary>成為他人的靈光</H2Primary>
            </div>
          )}

          <Link to="/login" className="btn-custom-secondary">
            註冊／登入
          </Link>
        </main>
      </div>
    </section>
  );
}

export default BeSalerSection;
