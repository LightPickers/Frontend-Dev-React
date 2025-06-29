import MobileNavbar from "@/components/header/mobile/MobileNavbar";
import Navbar from "@/components/header/desktop/Navbar";
import {
  useGetFeaturedCategoryQuery,
  useGetProductBrandsQuery,
} from "@features/products/productApi";
import getFeaturedData from "@/data/featuredCategoryData";

function Header() {
  // const {
  //   data: categories,
  //   isLoading: isGettingCategories,
  //   isSuccess: hasGotCategories,
  // } = useGetFeaturedCategoryQuery();
  const {
    data: brands,
    isLoading: isGettingBrands,
    isSuccess: hasGotBrands,
  } = useGetProductBrandsQuery();

  const isLoading = isGettingBrands;
  const isSuccess = hasGotBrands;
  // const isLoading = isGettingCategories || isGettingBrands;
  // const isSuccess = hasGotCategories && hasGotBrands;

  const featuredCategoriesList = getFeaturedData();
  // const featuredCategoriesList = categories?.data ?? [];
  const brandList = brands?.data ?? [];

  const menuItems = featuredCategoriesList.map(category => ({
    id: category.id,
    name: category.name,
    brands: brandList.map(brand => ({
      id: brand.id,
      name: brand.name,
    })),
  }));

  return (
    <>
      <Navbar
        className="d-none d-lg-block"
        menuItems={menuItems}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
      <MobileNavbar className="d-block d-lg-none" menuItems={menuItems} />
    </>
  );
}

export default Header;
