import Logo from "@/components/Logo";
import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* Header with logo at top left */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-8 lg:top-8 lg:left-12">
        <Logo size="large" />
      </div>
      
      {/* Main content centered */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center pt-12 sm:pt-16 lg:pt-20">
        <img src={brand2boostLogo} alt="Brand2Boost" className="mb-8 w-full max-w-xs" />
        
        <img src={featuresImage} alt="BrandForge features" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HeroIntro;
