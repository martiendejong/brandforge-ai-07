import logoImage from "@/assets/brandforge-logo.png";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: "h-6",
  medium: "h-8",
  large: "h-10",
};

const Logo = ({ size = "medium", className = "" }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="Brand2Boost Logo" 
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
