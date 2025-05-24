import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { H5Secondary } from "@components/Headings";
import { TextSmall, TextMedium, TextLarge, LabelText } from "@components/TextTypography";
import { SearchIcon, CartIcon } from "@components/icons";
import { formatPrice } from "@utils/formatPrice";
import FavoriteIconToggler from "@components/FavoriteIconToggler";
import CartIconToggler from "@components/CartIconToggler";

function ProductCard({ product }) {
  const { id, name, condition, primary_image, original_price, selling_price } = product;

  return (
    <main className="card product-card">
      {/* 圖片區域 */}
      <section className="card-image-container">
        {/* 商品主圖 */}
        <img src={primary_image} className="product-image object-fit-cover" alt={name} />

        {/* 機況標籤 */}
        <LabelText className="card-badge mt-5">{condition}</LabelText>

        {/* 懸停按鈕 */}
        <div className="icon-group">
          <Link to={`/products/${id}`} className="icon-btn">
            <SearchIcon title="查看商品" strokeWidth={1} />
          </Link>

          <FavoriteIconToggler productId={id} productName={name} />

          <CartIconToggler productId={id} productName={name} />

          {/* <button className="icon-btn">
            <CartIcon title="放入購物車" strokeWidth={1} />
          </button> */}
        </div>
      </section>

      <section className="card-body d-flex flex-column gap-1">
        {/* 卡片標題容器 => 限定兩行 */}
        <div
          className="line-clamp-2"
          style={{
            minHeight: "72px",
          }}
        >
          <H5Secondary isBold={false} className="text-gray-600">
            {name}
          </H5Secondary>
        </div>
        <TextSmall as="del" className="card-text text-gray-400">
          {`NT$ ${formatPrice(original_price, false)}`}
        </TextSmall>
        <p className="card-text">
          <TextMedium>NT$ </TextMedium>
          <TextLarge>{formatPrice(selling_price, false)}</TextLarge>
        </p>
      </section>
    </main>
  );
}
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
export default ProductCard;
