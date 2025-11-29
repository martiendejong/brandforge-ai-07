import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  return (
    <header className="h-12 border-b border-border bg-background flex items-center px-4 gap-3">
      <SidebarTrigger />
      <Link to="/" className="flex items-center">
        <Logo size="small" />
      </Link>
    </header>
  );
};

export default DashboardHeader;
