import Logo from "@/components/Logo";
import featuresImage from "@/assets/features-list.png";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* Header with logo at top left */}
      <div className="absolute top-4 left-6 sm:top-6 sm:left-8 lg:top-8 lg:left-12">
        <Logo size="large" />
      </div>
      
      {/* Main content centered */}
      <div className="mx-auto w-full max-w-xl flex-1 flex flex-col justify-center pt-12 sm:pt-16 lg:pt-20">
        <h2 className="mb-6 text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
          Build Your Brand Identity with AI
        </h2>
        
        <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Transform your idea into a complete brand identity in minutes. Our AI guides you through every step, 
          from naming to visual identity, creating a cohesive brand that resonates with your audience.
        </p>
        
        <img src={featuresImage} alt="BrandForge features" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HeroIntro;
