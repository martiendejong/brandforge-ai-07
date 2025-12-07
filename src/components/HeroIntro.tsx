import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* Main content centered */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center">
        <img src={brand2boostLogo} alt="Brand2Boost" className="mb-8 w-full max-w-xs" />
        
        <img src={featuresImage} alt="BrandForge features" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HeroIntro;
