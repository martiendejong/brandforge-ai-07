import { useState } from "react";
import HeroIntro from "@/components/HeroIntro";
import ChatInterfaceConnected from "@/components/ChatInterfaceConnected";
import ProjectSidebar from "@/components/ProjectSidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Loader2, Send, Paperclip, Plus, Mic, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";

const Index = () => {
  const {
    isAuthenticated,
    isAnonymous,
    projectId,
    isLoading,
    startAnonymousSession,
    convertToRegisteredUser,
  } = useOnboarding();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    
    // Start anonymous session and switch to full chat
    await handleFirstMessage();
  };

  const handleFirstMessage = async () => {
    // Start anonymous session on first message
    if (!isAuthenticated && !isLoading) {
      try {
        await startAnonymousSession();
        setIsFullScreen(true);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    }
  };

  const handleAuthComplete = async (userId: string) => {
    await convertToRegisteredUser(userId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Authenticated and converted (not anonymous) - show full app with sidebar
  if (isAuthenticated && !isAnonymous && projectId) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <ProjectSidebar projectId={projectId} />
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          <ChatInterfaceConnected
            projectId={projectId}
            onAuthRequired={handleAuthComplete}
            isAnonymous={false}
            isFullScreen={true}
          />
        </div>
      </div>
    );
  }

  // Anonymous user in full-screen chat
  if (isAuthenticated && isAnonymous && projectId && isFullScreen) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-[#0A0A0F]">
        {/* Hidden sidebar region - kept in DOM but invisible */}
        <div className="hidden lg:block lg:w-0 overflow-hidden"></div>
        
        <div className="flex-1 animate-fade-in relative">
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          <ChatInterfaceConnected
            projectId={projectId}
            onAuthRequired={handleAuthComplete}
            isAnonymous={true}
            isFullScreen={true}
          />
        </div>
      </div>
    );
  }

  // Landing page - overlay style with floating chat
  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Full-screen hero background */}
      <div className="absolute inset-0">
        <HeroIntro />
      </div>
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Floating content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Question text */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground text-center mb-8 lg:mb-12 max-w-3xl drop-shadow-lg">
          If you had to start earning money from a business in the next 90 days what would you create?
        </h1>
        
        {/* Floating chat bubble */}
        <div className="relative w-full max-w-2xl">
          {/* Gradient border effect */}
          <div className="absolute -inset-[6px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-[15px] opacity-75 blur-lg"></div>
          
          {/* Input bubble */}
          <div className="relative bg-card/95 backdrop-blur-sm rounded-[15px] shadow-2xl overflow-hidden border border-border/50">
            <div className="flex flex-col gap-3 px-6 py-8">
              {/* Textarea */}
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your business idea..."
                className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-lg resize-none min-h-[100px] p-0"
                disabled={isSending}
              />
              
              {/* Bottom row with action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full transition-transform duration-200 hover:scale-110 hover:bg-primary/10"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full transition-transform duration-200 hover:scale-110 hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full transition-transform duration-200 hover:scale-110 hover:bg-primary/10"
                  >
                    <Mic className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="h-9 w-9 rounded-full gradient-primary transition-transform duration-200 hover:scale-110"
                    disabled={!input.trim() || isSending}
                  >
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
