import { useState, useEffect, useRef } from "react";
import { Send, Zap, Loader2, Settings, User, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import AuthCard from "./AuthCard";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatInterfaceConnectedProps {
  projectId: string;
  onAuthRequired: (userId: string) => void;
  isAnonymous: boolean;
  isFullScreen?: boolean;
  onFirstMessage?: () => Promise<void>;
}

const ChatInterfaceConnected = ({ 
  projectId, 
  onAuthRequired,
  isAnonymous,
  isFullScreen = false,
  onFirstMessage
}: ChatInterfaceConnectedProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [isCheckingLoginPrompt, setIsCheckingLoginPrompt] = useState(false);
  const [avatarGender, setAvatarGender] = useState<"male" | "female">(
    () => (localStorage.getItem("avatarGender") as "male" | "female") || "female"
  );
  const [customAvatar, setCustomAvatar] = useState<string | null>(
    () => localStorage.getItem(`customAvatar_${avatarGender}`)
  );
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const defaultAvatar = avatarGender === "female" 
    ? "https://api.dicebear.com/7.x/notionists/svg?seed=BrandForge&backgroundColor=b6e3f4"
    : "https://api.dicebear.com/7.x/notionists/svg?seed=BrandForgeAI&backgroundColor=c0aede";
  
  const assistantAvatar = customAvatar || defaultAvatar;

  const handleGenderChange = async (gender: "male" | "female") => {
    setAvatarGender(gender);
    localStorage.setItem("avatarGender", gender);
    
    const savedAvatar = localStorage.getItem(`customAvatar_${gender}`);
    if (savedAvatar) {
      setCustomAvatar(savedAvatar);
    } else {
      setCustomAvatar(null);
    }
    
    toast({
      title: "Avatar Updated",
      description: `Assistant avatar changed to ${gender}.`,
    });
  };

  const handleGenerateAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { gender: avatarGender }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setCustomAvatar(data.imageUrl);
        localStorage.setItem(`customAvatar_${avatarGender}`, data.imageUrl);
        toast({
          title: "Avatar Generated",
          description: "New AI-generated avatar created successfully!",
        });
      }
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate avatar. Using default.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!projectId) {
        // Show welcome message when no project yet
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: "👋 Hi! I'm your AI branding assistant. Tell me about your business idea, and I'll help you create a complete brand identity."
        }]);
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (data && !error) {
        const loadedMessages = data.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content
        }));
        
        // Add welcome message if no existing messages
        if (loadedMessages.length === 0) {
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "👋 Hi! I'm your AI branding assistant. Tell me about your business idea, and I'll help you create a complete brand identity."
          }]);
        } else {
          setMessages(loadedMessages);
        }
      }
    };

    loadMessages();
  }, [projectId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if we should show login prompt
  useEffect(() => {
    const checkLoginPrompt = async () => {
      if (!isAnonymous || showAuthCard || isCheckingLoginPrompt || messages.length < 3) return;

      setIsCheckingLoginPrompt(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-login-prompt', {
          body: { project_id: projectId }
        });

        if (!error && data?.shouldPrompt) {
          setShowAuthCard(true);
        }
      } catch (error) {
        console.error('Error checking login prompt:', error);
      } finally {
        setIsCheckingLoginPrompt(false);
      }
    };

    // Check after each assistant message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      setTimeout(checkLoginPrompt, 1000);
    }
  }, [messages, isAnonymous, showAuthCard, projectId, isCheckingLoginPrompt]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Trigger first message handler if this is the first message
    if (messages.length === 0 && onFirstMessage) {
      await onFirstMessage();
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!projectId) {
      toast({
        title: "Error",
        description: "No project initialized. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limit reached",
            description: "Please wait a moment before sending another message.",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let assistantMsgId = Date.now().toString();

      if (reader) {
        let buffer = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const existing = prev.find(m => m.id === assistantMsgId);
                  if (existing) {
                    return prev.map(m => 
                      m.id === assistantMsgId 
                        ? { ...m, content: assistantMessage }
                        : m
                    );
                  }
                  return [...prev, { 
                    id: assistantMsgId, 
                    role: "assistant", 
                    content: assistantMessage 
                  }];
                });
              }
            } catch {
              // Partial JSON, wait for more data
            }
          }
        }

        // Save assistant message to database
        await supabase.from('chat_messages').insert({
          project_id: projectId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'assistant',
          content: assistantMessage
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={assistantAvatar} alt="AI Assistant" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground border border-border rounded-bl-sm"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {showAuthCard && isAnonymous && (
            <div className="flex justify-center my-8">
              <AuthCard onSuccess={onAuthRequired} />
            </div>
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={assistantAvatar} alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-card rounded-2xl rounded-bl-sm px-5 py-3 border border-border shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-full bg-background border border-border px-6 py-3 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your business idea..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceConnected;
