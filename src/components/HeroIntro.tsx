import { Sparkles, Palette, FileText, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
const HeroIntro = () => {
  const handleFeatureClick = (feature: string) => {
    console.log(`Feature clicked: ${feature}`);
  };
  return <div className="gradient-hero relative flex h-full flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex items-center gap-3">
          <Logo size="large" />
        </div>
        
        <h2 className="mb-6 text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
          Build Your Brand Identity with AI
        </h2>
        
        <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Transform your idea into a complete brand identity in minutes. Our AI guides you through every step, 
          from naming to visual identity, creating a cohesive brand that resonates with your audience.
        </p>
        
        <div className="grid gap-3 sm:gap-4">
          <Feature icon={<Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />} text="AI-powered brand strategy & naming" onClick={() => handleFeatureClick("strategy")} />
          <Feature icon={<Palette className="h-5 w-5 sm:h-6 sm:w-6" />} text="Custom logos & visual identity" onClick={() => handleFeatureClick("logos")} />
          <Feature icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />} text="Brand voice & messaging guidelines" onClick={() => handleFeatureClick("voice")} />
          <Feature icon={<Rocket className="h-5 w-5 sm:h-6 sm:w-6" />} text="From idea to launch-ready brand" onClick={() => handleFeatureClick("launch")} />
        </div>
      </div>
    </div>;
};
const Feature = ({
  icon,
  text,
  onClick
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) => {
  return <Button variant="ghost" onClick={onClick} className="flex h-auto items-center justify-start gap-3 px-4 py-3 text-left transition-all hover:scale-[1.02] hover:bg-primary/10 hover:text-foreground sm:gap-4 sm:px-5 sm:py-4">
      <span className="text-accent">{icon}</span>
      <span className="text-sm font-medium sm:text-base">{text}</span>
    </Button>;
};
export default HeroIntro;