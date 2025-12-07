import featuresImage from "@/assets/features-list.png";
import brand2boostLogo from "@/assets/brand2boost-logo.png";
import { ParticleBackground } from "./ParticleBackground";

const HeroIntro = () => {
  return (
    <div className="gradient-hero relative flex h-full flex-col px-4 py-8 sm:px-8 sm:py-12 lg:px-12 overflow-hidden">
      {/* GPGPU Particle Background */}
      <ParticleBackground />
      
      {/* Main content centered */}
      <div className="relative z-10 mx-auto w-full max-w-xl flex-1 flex flex-col justify-center">
        <img src={brand2boostLogo} alt="Brand2Boost" className="-mt-32 mb-8 w-full max-w-xs" />
        
        <img src={featuresImage} alt="BrandForge features" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default HeroIntro;
