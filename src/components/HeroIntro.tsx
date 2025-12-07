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
        <div className="mb-8">
          <img src={featuresImage} alt="BrandForge features" className="w-full max-w-sm rounded-lg" />
        </div>
      </div>
      
      {/* Feature icons row at bottom */}
      <div className="grid grid-cols-4 gap-4 mt-auto pt-6 border-t border-border/30">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xs lg:text-sm text-muted-foreground">Launch in<br />90 days or less</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xs lg:text-sm text-muted-foreground">AI-powered<br />business creation</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <PenTool className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xs lg:text-sm text-muted-foreground">Branding that<br />stands out</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xs lg:text-sm text-muted-foreground">Growth-focused<br />strategy</span>
        </div>
      </div>
    </div>
  );
};

export default HeroIntro;
