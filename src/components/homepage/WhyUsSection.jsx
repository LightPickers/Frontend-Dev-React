import { H2Primary } from "@components/Headings";
import { WHY_US_REASONS } from "@data/marketingMaterials";
import { H3Primary, H5Secondary } from "@components/Headings";

function WhyUsSection() {
  const promotionalData = WHY_US_REASONS;
  return (
    <section className="container py-30">
      <H2Primary className="heading-em-dash mb-10">為什麼選擇我們</H2Primary>
      <main className="d-flex flex-column gap-20">
        {promotionalData.map((reason, index) => {
          return (
            <div
              className={`row align-items-center justify-content-between ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
              key={index}
            >
              {/* 文字區塊 */}
              <div className="col-lg-4 col-md-5">
                <H3Primary className="mb-4">{reason.title}</H3Primary>
                <H5Secondary isBold={false} className="mb-md-0 mb-4">
                  {reason.description}
                </H5Secondary>
              </div>
              <div className="col-md-7">
                <img src={reason.image_lg} alt={reason.title} />
              </div>
            </div>
          );
        })}
      </main>
    </section>
  );
}

export default WhyUsSection;
