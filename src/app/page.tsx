import AdsSlider from "@/components/Home/AdsSlider";
import BlogSlider from "@/components/Home/BlogSlider";
import HomeCategorySlider from "@/components/Home/HomeCategorySlider";
import HomeShipping from "@/components/Home/HomeShipping";
import HomeSlider from "@/components/Home/HomeSlider";
import PopularProducts from "@/components/Home/ProductsSlider";

const Home = () => {
  return (
    <>
      <HomeSlider />
      <HomeCategorySlider />
      <PopularProducts
        title={"Popular Products with categories"}
        description={"Do not miss the current offers until end of March"}
      />
      <HomeShipping />
      <AdsSlider item={4} />
      <PopularProducts title={"Latest Products"} />
      <AdsSlider item={2} />
      <PopularProducts title={"Featured Products"} />
      {/* <AdsSlider item={2} /> */}
      <BlogSlider item={4} />
    </>
  );
};

export default Home;
