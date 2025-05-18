import MobileNavbar from "@components/header/MobileNavbar";
import DesktopNavbar from "@components/header/DesktopNavbar";
import {
  useGetFeaturedCategoryQuery,
  useGetProductBrandsQuery,
} from "@features/products/productApi";

function Header() {
  // const { data: categories } = useGetFeaturedCategoryQuery(); // undefined
  // const { data: brands } = useGetProductBrandsQuery();

  // console.log(categories, brands);

  const brands = [
    {
      id: "brand-001",
      name: "Sonia",
    },
    {
      id: "brand-002",
      name: "Kano",
    },
    {
      id: "brand-003",
      name: "Polex",
    },
  ];

  const featuredCategories = [
    {
      id: "6a628b50-fd32-4ecb-bc1c-a875f71939c9",
      name: "機身",
      image: "https://example.com/instant.jpg",
    },
    {
      id: "7fd5cbd6-a19a-414b-b55b-07029c594880",
      name: "相機",
      image: "https://example.com/instant.jpg",
    },
    {
      id: "44dee423-8758-48ed-a1d1-b954fa50fc57",
      name: "鏡頭",
      image: "https://example.com/instant.jpg",
    },
    {
      id: "2a847d50-f0f6-444d-86d2-1b401369cb24",
      name: "配件",
      image: "https://example.com/instant.jpg",
    },
  ];

  const menuItems = featuredCategories.map(category => ({
    id: category.id,
    name: category.name,
    brands: brands.map(brand => ({
      id: brand.id,
      name: brand.name,
    })),
  }));

  return (
    <>
      <DesktopNavbar className="d-none d-lg-block" menuItems={menuItems} />
      {/* <MobileNavbar className="d-block d-md-none" menuItems={menuItems} /> */}
    </>
  );
}

export default Header;
