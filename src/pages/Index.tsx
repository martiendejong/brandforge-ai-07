import { useState } from "react";
import HeroIntro from "@/components/HeroIntro";
import ChatInterfaceConnected from "@/components/ChatInterfaceConnected";
import ProjectSidebar from "@/components/ProjectSidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex-1">
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
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Hidden sidebar region - kept in DOM but invisible */}
        <div className="hidden lg:block lg:w-0 overflow-hidden"></div>
        
        <div className="flex-1">
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

  // Landing page - split view with intro and chat
  return (
    <div className="h-screen w-full overflow-hidden bg-background gradient-hero">
      {/* Desktop: Split view (intro left, chat right) */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left panel - Hero intro (desktop only) */}
        <div className={`lg:w-1/2 ${isFullScreen ? 'hidden' : 'hidden lg:flex'}`}>
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
              Build Your Brand Identity with AI
            </h2>
            <p className="text-sm text-muted-foreground">
              Transform your idea into a complete brand identity in minutes.
            </p>
          </div>
        </div>

        {/* Right panel - Question text and chat bubble */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Question text */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground text-center mb-8 lg:mb-12 max-w-2xl">
            If you had to start earning money from a business in the next 90 days what would you create?
          </h1>
          
          {/* Chat bubble container with gradient border */}
          <div className="relative w-full max-w-2xl">
            {/* Gradient border effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full opacity-75 blur-sm"></div>
            
            {/* Input bubble */}
            <div className="relative bg-[#FFF9F0] dark:bg-background rounded-full shadow-xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-8">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your business idea..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-full hover:bg-accent flex-shrink-0"
                  disabled={!input.trim() || isSending}
                >
                  <Send className="h-5 w-5 text-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
