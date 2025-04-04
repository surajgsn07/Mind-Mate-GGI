import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

import Footer from "./components/Footer";
import Featured from "./components/Featured/Featured";
import FeatureSection from "./components/FeatureSection";
import CTAs from "./components/CTAs";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";

const Home = () => {
  return (
    <>
      <div className="mx-auto ">
        <div className=" px-6">
          <HeroSection />
        </div>
        <div className="pt-20   ">
          <Featured />
        </div>
        <div className="pt-20 px-6 md:px-30 ">
          <CTAs />
        </div>
        <div className="pt-20 px-6 md:px-30 ">
          <FeatureSection />
          {/* <Testimonials /> */}
          <Team />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
