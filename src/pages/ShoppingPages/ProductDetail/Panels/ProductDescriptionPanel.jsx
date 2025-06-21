import { useOutletContext } from "react-router-dom";

import { H3Primary, H5Secondary } from "@components/Headings";
import DeltaToHtmlRenderer from "@components/productDetailPage/DeltaToHtmlRenderer";

function ProductDescriptionPanel() {
  const { id, title, subtitle, description, primary_image, hashtags } = useOutletContext();
  return (
    <article className="product-article row bg-white">
      <section className="d-flex flex-column gap-3">
        <H3Primary>{title}</H3Primary>
        <H5Secondary isBold={false}>{subtitle}</H5Secondary>
        <div className="img-container">
          {primary_image && (
            <img
              src={primary_image}
              alt={title}
              className="img-fluid object-fit-cover h-100 w-100"
            />
          )}
        </div>
      </section>
      <section className="d-flex flex-column">
        <div className="d-flex flex-wrap justify-content-center align-items-center flex-md-row flex-column gap-md-3 gap-2 py-md-4 py-2">
          {hashtags.map((tag, index) => {
            return (
              <H5Secondary key={index} isBold={false} className="text-white tag-for-feature">
                #{tag}
              </H5Secondary>
            );
          })}
        </div>
        {description && <DeltaToHtmlRenderer delta={description} />}
      </section>
    </article>
  );
}

export default ProductDescriptionPanel;
