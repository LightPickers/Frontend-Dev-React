import { string } from "prop-types";
import { Link } from "react-router-dom";

import { useGetProductBrandsQuery } from "@features/products/productApi";
import { TextLarge, TextMedium } from "@components/TextTypography";

function ProductSidebar({ category, categoryId }) {
  const { data } = useGetProductBrandsQuery();
  const brandList = data?.data ?? [];

  return (
    <aside className="col-lg-2 d-lg-flex d-none px-2 py-1 flex-column gap-3">
      <TextLarge as="p" className="px-2 pt-1 pb-2 border-bottom border-gray-200 mb-1">
        {category}
      </TextLarge>
      <ul className="ps-0 d-flex flex-column gap-3">
        {brandList?.map(item => {
          const { id: brandId, name: brand } = item;
          return (
            <li key={brandId}>
              <TextMedium
                as={Link}
                to={`/products?brand_id=${brandId}&category_id=${categoryId}`}
                className="px-2 py-1"
              >
                {brand}
              </TextMedium>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
ProductSidebar.propTypes = {
  category: string.isRequired,
  categoryId: string.isRequired,
};
export default ProductSidebar;
