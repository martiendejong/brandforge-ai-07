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

  // Landing page - hero as background with chat bubble
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-width hero background */}
      <div className="absolute inset-0 w-full">
        <HeroIntro />
      </div>
      
      {/* Chat bubble overlay - positioned on the right side */}
      <div className="relative z-10 flex h-full items-center justify-end px-4 sm:px-8 lg:px-16">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden bg-background/95 backdrop-blur-sm border border-border/50">
          <ChatInterfaceConnected
            projectId={projectId || ''}
            onAuthRequired={handleAuthComplete}
            isAnonymous={isAnonymous}
            isFullScreen={false}
            onFirstMessage={handleFirstMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
