import { H2Primary, H3Primary } from "@components/Headings";
import { BtnPrimary } from "@components/Buttons";

// GET-/api/v1/category/featured
function FeaturedCategories() {
  const categories = [
    { id: "cat_01", name: "類單眼相機", image: "https://fakeimg.pl/200x200/?text=camera" },
    { id: "cat_02", name: "機身", image: "https://fakeimg.pl/200x200/?text=cam_body" },
    { id: "cat_03", name: "鏡頭", image: "https://fakeimg.pl/200x200/?text=lens" },
    { id: "cat_04", name: "配件", image: "https://fakeimg.pl/200x200/?text=kits" },
  ];
  return (
    <div className="bg-gray-100">
      <section className="container py-30">
        <H2Primary className="heading-em-dash mb-10">矚目類別</H2Primary>
        <div className="row">
          {categories.map(category => {
            const { id, name, image } = category;
            return (
              <div className="col-md-3 col-6" key={id}>
                <main className="category-card d-flex flex-column align-items-center justify-content-between gap-7 pt-7 pb-9">
                  <div className="image-container">
                    <img className="category-image" src={image} alt={name} />
                  </div>
                  <H3Primary className="text-gray-600">{name}</H3Primary>
                  <BtnPrimary>查看更多</BtnPrimary>
                </main>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default FeaturedCategories;
