import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-8 w-24 h-24 rounded-full bg-accent/10 blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-primary/5 blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        
        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl" />
      </div>

      {/* Main content centered */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center relative z-10">
        <img 
          src={brand2boostLogo} 
          alt="Brand2Boost" 
          className="-mt-8 mb-8 w-full max-w-xs animate-fade-in-up hover:scale-105 transition-transform duration-300" 
        />
        
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
