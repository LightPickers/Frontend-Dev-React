import { H2Primary } from "@components/Headings";
import { WHY_US_REASONS } from "@data/marketingMaterials";
import { H3Primary, H5Secondary } from "@components/Headings";
import useBreakpoint from "@hooks/useBreakpoints";

function WhyUsSection() {
  const promotionalData = WHY_US_REASONS;
  const isSmUp = useBreakpoint("xs");
  return (
    <div className="bg-white">
      <section className="container-md container-fluid py-md-30 py-15">
        <H2Primary className="heading-em-dash mb-10">為什麼選擇我們</H2Primary>
        <main className="d-flex flex-column gap-md-20 gap-sm-15 gap-10">
          {promotionalData.map((reason, index) => {
            const { id, title, description, images } = reason;
            const { image_lg, image_sm } = images;
            return (
              <div
                className={`row align-items-center justify-content-between ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                key={id}
              >
                {/* 圖片區塊 */}
                <div className="col-lg-7 col-md-6 mb-md-0 mb-sm-6 mb-3">
                  <div className="seafoam-overlay rounded-lg-4 rounded-sm-3 rounded-2">
                    <img src={!isSmUp ? image_lg : image_sm} alt={title} />
                  </div>
                </div>
                {/* 文字區塊 */}
                <div className="col-xl-4 col-lg-5 col-md-6">
                  <H3Primary className="text-nowrap mb-4">{title}</H3Primary>
                  <H5Secondary isBold={false} className="mb-md-0 mb-4">
                    {description}
                  </H5Secondary>
                </div>
              </div>
            );
          })}
        </main>
      </section>
    </div>
  );
}

export default WhyUsSection;
