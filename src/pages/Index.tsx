import { useState, useEffect } from "react";
import HeroIntro from "@/components/HeroIntro";
import ChatInterfaceConnected from "@/components/ChatInterfaceConnected";
import ProjectSidebar from "@/components/ProjectSidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Loader2 } from "lucide-react";

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
    <div className="h-screen w-full overflow-hidden bg-background">
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
          <h1 className="text-xl font-semibold text-foreground text-center mb-8 lg:mb-12 max-w-2xl">
            If you had to start earning money from a business in the next 90 days what would you create?
          </h1>
          
          {/* Chat bubble container with gradient border */}
          <div className="relative w-full max-w-3xl">
            {/* Gradient border effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl opacity-75 blur-sm"></div>
            
            {/* Chat bubble */}
            <div className="relative bg-[#FFF9F0] dark:bg-background rounded-3xl shadow-xl overflow-hidden h-[600px] flex flex-col">
              <ChatInterfaceConnected
                projectId={projectId || ''}
                onAuthRequired={handleAuthComplete}
                isAnonymous={isAnonymous}
                isFullScreen={isFullScreen}
                onFirstMessage={handleFirstMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
