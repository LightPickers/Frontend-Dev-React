import ProductShowcase from "@components/homepage/ProductShowcase";
const SELETED_PRODUCTS = [
  {
    id: 1,
    condition: "近全新",
    name: "Sonica a7S 單機身",
    selling_price: 38000,
    original_price: 54900,
    primary_image: "/images/product1.jpg",
    brand: "sonia",
  },
  {
    id: 2,
    condition: "狀況良好",
    name: "Polex B8 雙八釐米 電影攝影機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product2.jpg",
    brand: "sonia",
  },
  {
    id: 3,
    condition: "還堪使用",
    name: "Seizz zxlee 2/40 CF 40mm F2.0 定焦鏡頭",
    selling_price: 30000,
    original_price: 45900,
    primary_image: "/images/product3.jpg",
    brand: "sonia",
  },
  {
    id: 4,
    condition: "包裝未拆",
    name: "Ruzifilm instax mini Evo 拍立得相機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product4.jpg",
    brand: "sonia",
  },
  {
    id: 5,
    condition: "包裝未拆",
    name: "Ruzifilm instax mini Evo 拍立得相機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product4.jpg",
    brand: "sonia",
  },
];
const LATEST_PRODUCTS = [
  {
    id: 1,
    condition: "狀況良好",
    name: "Polex B8 雙八釐米 電影攝影機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product2.jpg",
    brand: "sonia",
  },
  {
    id: 2,
    condition: "近全新",
    name: "Sonica a7S 單機身",
    selling_price: 38000,
    original_price: 54900,
    primary_image: "/images/product1.jpg",
    brand: "sonia",
  },
  {
    id: 3,
    condition: "還堪使用",
    name: "Seizz zxlee 2/40 CF 40mm F2.0 定焦鏡頭",
    selling_price: 30000,
    original_price: 45900,
    primary_image: "/images/product3.jpg",
    brand: "sonia",
  },
  {
    id: 4,
    condition: "包裝未拆",
    name: "Ruzifilm instax mini Evo 拍立得相機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product4.jpg",
    brand: "sonia",
  },
  {
    id: 5,
    condition: "包裝未拆",
    name: "Ruzifilm instax mini Evo 拍立得相機",
    selling_price: 8000,
    original_price: 14900,
    primary_image: "/images/product4.jpg",
    brand: "sonia",
  },
];
function ProductSection() {
  return (
    <>
      {/* 精選產品 */}
      <div className="bg-gray-100">
        <ProductShowcase title={"精選商品"} products={SELETED_PRODUCTS} />
      </div>

      <ProductShowcase title={"最新商品"} products={LATEST_PRODUCTS} />
    </>
  );
}

export default ProductSection;
