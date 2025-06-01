import { useOutletContext } from "react-router-dom";

function ProductDescriptionPanel() {
  const { id, title, subtitle, description, primary_image, hashtags } = useOutletContext();
  return (
    <>
      <p>我是商品描述分頁</p>
    </>
  );
}

export default ProductDescriptionPanel;
