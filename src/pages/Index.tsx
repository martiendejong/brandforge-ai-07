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

  // Landing page - split view with intro and chat (landscape desktop)
  return (
    <div className="h-screen w-full overflow-hidden bg-background gradient-hero relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Desktop: Landscape split view */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left panel - Hero intro with content */}
        <div className={`lg:w-[55%] xl:w-1/2 ${isFullScreen ? 'hidden' : 'hidden lg:flex'}`}>
          <HeroIntro />
        </div>
        
        {/* Mobile intro (shown on top) */}
        <div className={`lg:hidden ${isFullScreen ? 'hidden' : 'flex'}`}>
          <div className="w-full p-6 border-b border-border">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h1 className="text-2xl font-bold">
                Brand<span className="text-gradient-primary">Forge</span>
              </h1>
            </div>
            <h2 className="mb-3 text-xl font-semibold">
              Turn Your Ideas Into Income — Fast.
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered business creation & digital branding that gets results.
            </p>
          </div>
        </div>

        {/* Right panel - Chat card */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 xl:p-12">
          {/* Chat card container */}
          <div className="relative w-full max-w-lg">
            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30 rounded-2xl opacity-60 blur-xl"></div>
            
            {/* Chat card */}
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col gap-4 p-6 lg:p-8">
                {/* Question text inside card */}
                <h2 className="text-lg lg:text-xl font-medium text-foreground leading-relaxed">
                  If you had to start earning money in the next 90 days...<br />
                  <span className="text-muted-foreground">what would you create?</span>
                </h2>
                
                {/* Textarea */}
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your business idea..."
                  className="flex-1 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary text-base resize-none min-h-[100px] rounded-xl p-4"
                  disabled={isSending}
                />
                
                {/* Bottom row with action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSend}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    disabled={!input.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
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
