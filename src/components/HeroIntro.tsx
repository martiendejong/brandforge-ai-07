import aiHandImage from "@/assets/ai-hand-image.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";

const HeroIntro = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo at top */}
      <div className="mb-auto">
        <img 
          src={brand2boostLogo} 
          alt="Brand2Boost" 
          className="w-48 lg:w-64" 
        />
      </div>
      
      {/* AI hand image at bottom */}
      <div className="mt-auto">
        <img 
          src={aiHandImage} 
          alt="AI powered branding" 
          className="w-full max-w-sm rounded-lg" 
        />
      </div>
    </div>
  );
};

export default HeroIntro;
