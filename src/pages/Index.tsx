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

  // Landing page - split view with intro and chat
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0a1628] relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Desktop: Split view */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left panel - Logo and Video/Image */}
        <div className={`lg:w-1/2 ${isFullScreen ? 'hidden' : 'hidden lg:flex'} flex-col p-8 lg:p-12`}>
          <HeroIntro />
        </div>
        
        {/* Mobile intro (shown on top) */}
        <div className={`lg:hidden ${isFullScreen ? 'hidden' : 'flex'}`}>
          <div className="w-full p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h1 className="text-2xl font-bold text-amber-400">
                Brand<span className="text-orange-500">2Boost</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Right panel - Question text and chat bubble */}
        <div className="flex-1 flex flex-col items-start justify-center p-6 lg:p-12">
          {/* Question text */}
          <div className="text-left mb-6 lg:mb-8 max-w-2xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium italic leading-relaxed">
              <span className="text-slate-300">If you had to start</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                earning money
              </span>
              <br />
              <span className="text-slate-300">from a business in the next</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                90 days
              </span>
              <br />
              <span className="text-slate-300">what would you create?</span>
            </h1>
          </div>

          {/* Start Your Journey Button */}
          <Button 
            className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105"
            onClick={handleFirstMessage}
          >
            Start Your Journey Now
          </Button>
          
          {/* Chat bubble container with purple gradient border */}
          <div className="relative w-full max-w-xl">
            {/* Purple gradient border effect */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600 rounded-2xl"></div>
            
            {/* Input bubble */}
            <div className="relative bg-[#0f1a2e] rounded-2xl overflow-hidden">
              {/* Header text */}
              <div className="px-6 pt-6 pb-4">
                <p className="text-slate-400 text-sm">Start describing your business idea...</p>
              </div>
              
              {/* Input area */}
              <div className="px-6 pb-6">
                <div className="bg-[#1a2744] rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your business idea..."
                      className="flex-1 bg-transparent border-0 text-slate-300 placeholder:text-slate-500 focus:outline-none text-sm"
                      disabled={isSending}
                    />
                    
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
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
    </div>
  );
};

export default Index;
