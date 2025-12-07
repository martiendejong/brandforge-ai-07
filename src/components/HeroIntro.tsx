import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* Header with Brand2Boost logo at top left */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-8 lg:top-8 lg:left-12">
        <img src={brand2boostLogo} alt="Brand2Boost" className="h-16 w-auto sm:h-20 lg:h-24" />
      </div>
      
      {/* Main content moved down */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        
        <img src={featuresImage} alt="BrandForge features" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HeroIntro;
