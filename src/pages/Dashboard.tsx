import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Plus, Mic } from "lucide-react";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you with content generation today?",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          {/* Main Content Area with Chat and Preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Middle Panel - Chat Interface */}
            <div className="flex-1 flex flex-col border-r border-border">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t border-border p-4">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <div className="flex flex-col gap-3 px-4 py-4">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-sm resize-none min-h-[80px] p-0"
                    />
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-accent"
                      >
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-accent"
                      >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <div className="flex-1" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-accent"
                      >
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        onClick={handleSend}
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full hover:bg-accent"
                        disabled={!input.trim()}
                      >
                        <Send className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-[400px] bg-background overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                
                {/* Profile Preview */}
                <div className="bg-card rounded-lg p-4 mb-4 border border-border">
                  <h3 className="text-sm font-medium mb-3">Profile</h3>
                  <div className="flex justify-center mb-3">
                    <div className="h-20 w-20 rounded-full bg-cyan-400" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Your new profile has been generated
                  </p>
                </div>

                {/* Logo Preview */}
                <div className="bg-card rounded-lg p-4 mb-4 border border-border">
                  <h3 className="text-sm font-medium mb-3">Logo</h3>
                  <div className="flex justify-center mb-3">
                    <div className="h-24 w-full rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">AI</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Brand identity ready to use
                  </p>
                </div>

                {/* Color Palette Preview */}
                <div className="bg-card rounded-lg p-4 mb-4 border border-border">
                  <h3 className="text-sm font-medium mb-3">Color Palette</h3>
                  <div className="flex gap-2 justify-center mb-3">
                    <div className="h-12 w-12 rounded-lg bg-cyan-400" />
                    <div className="h-12 w-12 rounded-lg bg-orange-400" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Consistent and modern
                  </p>
                </div>

                {/* Recent Post Preview */}
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium mb-3">Recent Post</h3>
                  <div className="h-32 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
