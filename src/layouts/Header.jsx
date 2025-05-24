import MobileNavbar from "@components/header/MobileNavbar";
import Navbar from "@/components/header/desktop/Navbar";
import {
  useGetProductConditionsQuery,
  useGetFeaturedCategoryQuery,
  useGetProductBrandsQuery,
  useGetProductCategoryQuery, // 測試
} from "@features/products/productApi";

function Header() {
  const { data: categories } = useGetFeaturedCategoryQuery();
  const { data: brands } = useGetProductBrandsQuery();
  const { data: allCategories } = useGetProductCategoryQuery();
  const { data: conditions } = useGetProductConditionsQuery();

  const featuredCategoriesList = categories?.data ?? [];
  const brandList = brands?.data ?? [];
  const categoryList = allCategories?.data ?? [];

  // console.log({ featuredCategoriesList }, { brandList }, { allCategories }, { conditions });

  // const testBrands = [
  //   {
  //     id: "brand-001",
  //     name: "Sonia",
  //   },
  //   {
  //     id: "brand-002",
  //     name: "Kano",
  //   },
  //   {
  //     id: "brand-003",
  //     name: "Polex",
  //   },
  // ];

  // const testFeaturedCategories = [
  //   {
  //     id: "6a628b50-fd32-4ecb-bc1c-a875f71939c9",
  //     name: "機身",
  //     image: "https://example.com/instant.jpg",
  //   },
  //   {
  //     id: "7fd5cbd6-a19a-414b-b55b-07029c594880",
  //     name: "相機",
  //     image: "https://example.com/instant.jpg",
  //   },
  //   {
  //     id: "44dee423-8758-48ed-a1d1-b954fa50fc57",
  //     name: "鏡頭",
  //     image: "https://example.com/instant.jpg",
  //   },
  //   {
  //     id: "2a847d50-f0f6-444d-86d2-1b401369cb24",
  //     name: "配件",
  //     image: "https://example.com/instant.jpg",
  //   },
  // ];

  const menuItems = categoryList.map(category => ({
    id: category.id,
    name: category.name,
    brands: brandList.map(brand => ({
      id: brand.id,
      name: brand.name,
    })),
  }));

  return (
    <>
      <Navbar className="d-none d-lg-block" menuItems={menuItems} />
      {/* <MobileNavbar className="d-block d-lg-none" menuItems={menuItems} /> */}
    </>
  );
}

export default Header;
