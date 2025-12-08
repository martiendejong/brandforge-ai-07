import { ArrowRight } from "lucide-react";
import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";
import { Button } from "@/components/ui/button";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-8 w-24 h-24 rounded-full bg-accent/10 blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/5 blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-primary/20 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-1/3 right-16 w-8 h-8 border border-accent/20 rotate-12 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        
        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl" />
      </div>

      {/* Main content centered */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center relative z-10">
        <img 
          src={brand2boostLogo} 
          alt="Brand2Boost" 
          className="-mt-8 mb-6 w-full max-w-xs animate-fade-in-up hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Typewriter tagline with glow accents */}
        <div className="mb-8 overflow-hidden">
          <p className="text-lg sm:text-xl text-foreground/90 font-light leading-relaxed">
            <span className="inline-block overflow-hidden whitespace-nowrap animate-typewriter border-r-2 border-primary pr-1 animate-blink">
              If you had to start{" "}
              <span className="font-semibold text-accent animate-text-glow">earning money</span>{" "}
              from a business in the next{" "}
              <span className="font-bold text-primary animate-text-glow">90 days</span>{" "}
              what would you create?
            </span>
          </p>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="mb-8 w-fit group gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Building
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <img
          src={featuresImage} 
          alt="BrandForge features" 
          className="w-full max-w-md animate-fade-in-up hover:scale-[1.02] transition-transform duration-300" 
          style={{ animationDelay: '0.2s' }}
        />
      </div>
    </div>
  );
};

export default HeroIntro;
