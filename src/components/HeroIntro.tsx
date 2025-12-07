import brand2boostLogo from "@/assets/brand2boost-logo.png";
import featuresImage from "@/assets/features-list.png";
import { Lightbulb, Users, PenTool, TrendingUp } from "lucide-react";

const HeroIntro = () => {
  return (
    <div className="relative flex h-full flex-col px-6 py-6 lg:px-10 lg:py-8">
      {/* Header with Brand2Boost logo at top left */}
      <div className="mb-8">
        <img src={brand2boostLogo} alt="Brand2Boost" className="h-10 w-auto sm:h-12 lg:h-14" />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl">
        {/* Main headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 leading-tight">
          Turn Your Ideas<br />
          Into Income — <span className="text-accent">Fast.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-md">
          AI-powered business creation & digital branding that gets results.
        </p>
        
        {/* AI + Branding = Growth section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">
            AI + Branding = Growth
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base max-w-sm">
            We help you create, refine and launch ideas that grow fast.
          </p>
        </div>
        
        {/* Features image */}
        <div>
          <img src={featuresImage} alt="BrandForge features" className="w-full max-w-sm rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default HeroIntro;
