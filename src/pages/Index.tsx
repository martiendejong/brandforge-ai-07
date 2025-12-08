import { useState } from "react";
import HeroIntro from "@/components/HeroIntro";
import ChatInterfaceConnected from "@/components/ChatInterfaceConnected";
import ProjectSidebar from "@/components/ProjectSidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Loader2, Send, Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Textarea } from "@/components/ui/textarea";

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

  // Landing page - split view with intro and chat
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0a1628] relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Two-column grid layout */}
      <div className="grid h-full lg:grid-cols-2">
        {/* Left column - Logo and AI hand image */}
        <div className="hidden lg:flex flex-col p-8 lg:p-12">
          <HeroIntro />
        </div>
        
        {/* Right column - Question and chat input */}
        <div className="flex flex-col justify-center p-6 lg:p-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <HeroIntro />
          </div>
          
          {/* Question text */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-tight mb-8 lg:mb-12">
            If you had to start earning money from a business in the next 90 days what would you create?
          </h1>
          
          {/* Chat input container with gradient border */}
          <div className="relative w-full max-w-xl">
            {/* Gradient border effect */}
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80"></div>
            
            {/* Input container */}
            <div className="relative bg-[#1a2744] rounded-2xl p-6">
              {/* Textarea */}
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your business idea..."
                className="w-full bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base resize-none min-h-[200px] p-0 mb-4"
                disabled={isSending}
              />
              
              {/* Bottom row with action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-white/10"
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-white/10"
                  >
                    <Plus className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-white/10"
                  >
                    <Mic className="h-5 w-5 text-gray-400" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-white/10"
                    disabled={!input.trim() || isSending}
                  >
                    <Send className="h-5 w-5 text-gray-400" />
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
