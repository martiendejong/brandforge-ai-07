import { useState } from "react";
import {
  MessageCircle,
  FileText,
  Database,
  Link as LinkIcon,
  Sparkles,
  Search,
  Settings,
  Upload,
  Plus,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
}

interface DocumentItem {
  id: string;
  title: string;
  uploadDate: string;
}

interface GeneratedItem {
  id: string;
  title: string;
  generated: boolean;
}

interface LinkedAccount {
  id: string;
  name: string;
  icon: string;
}

const mockChats: ChatItem[] = [
  { id: "1", title: "Brand Strategy Discussion", timestamp: "2 hours ago" },
  { id: "2", title: "Logo Design Ideas", timestamp: "Yesterday" },
  { id: "3", title: "Marketing Campaign", timestamp: "2 days ago" },
  { id: "4", title: "Website Content", timestamp: "3 days ago" },
];

const mockDocuments: DocumentItem[] = [
  { id: "1", title: "Brand Guidelines.pdf", uploadDate: "Dec 15, 2024" },
  { id: "2", title: "Logo Assets.zip", uploadDate: "Dec 14, 2024" },
  { id: "3", title: "Marketing Plan.docx", uploadDate: "Dec 13, 2024" },
  { id: "4", title: "Product Photos.zip", uploadDate: "Dec 12, 2024" },
];

const mockGenerated: GeneratedItem[] = [
  { id: "1", title: "Brand Name", generated: true },
  { id: "2", title: "Logo Design", generated: true },
  { id: "3", title: "Color Palette", generated: false },
  { id: "4", title: "Typography Guide", generated: false },
];

const mockAccounts: LinkedAccount[] = [
  { id: "1", name: "Twitter", icon: "🐦" },
  { id: "2", name: "LinkedIn", icon: "💼" },
  { id: "3", name: "GitHub", icon: "🐙" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [chatSearch, setChatSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [genSearch, setGenSearch] = useState("");

  const [recentChatsOpen, setRecentChatsOpen] = useState(true);
  const [documentsOpen, setDocumentsOpen] = useState(true);
  const [dataOpen, setDataOpen] = useState(false);
  const [linkedAccountsOpen, setLinkedAccountsOpen] = useState(false);
  const [generatedOpen, setGeneratedOpen] = useState(true);

  return (
    <Sidebar className={cn(collapsed ? "w-14" : "w-[280px]")} collapsible="icon">
      <SidebarContent className="overflow-y-auto">
        {/* Recent Chats Section */}
        <Collapsible open={recentChatsOpen} onOpenChange={setRecentChatsOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-accent/50 transition-colors">
                <MessageCircle className="h-4 w-4 mr-2" />
                {!collapsed && "Recent Chats"}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search chats..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                  <SidebarMenu>
                    {mockChats.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton className="hover:bg-accent">
                          <MessageCircle className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{chat.title}</div>
                            <div className="text-xs text-muted-foreground">{chat.timestamp}</div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground mt-2">
                    more...
                  </Button>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Documents Section */}
        <Collapsible open={documentsOpen} onOpenChange={setDocumentsOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-accent/50 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                {!collapsed && "Documents"}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                  <SidebarMenu>
                    {mockDocuments.map((doc) => (
                      <SidebarMenuItem key={doc.id}>
                        <SidebarMenuButton className="hover:bg-accent">
                          <FileText className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{doc.title}</div>
                            <div className="text-xs text-muted-foreground">{doc.uploadDate}</div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground mt-2">
                    more...
                  </Button>
                  <div className="px-2 pt-2">
                    <Button variant="default" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </Button>
                  </div>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Data Section */}
        <Collapsible open={dataOpen} onOpenChange={setDataOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-accent/50 transition-colors">
                <Database className="h-4 w-4 mr-2" />
                {!collapsed && "Data"}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="px-2 py-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Linked Accounts Section */}
        <Collapsible open={linkedAccountsOpen} onOpenChange={setLinkedAccountsOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-accent/50 transition-colors">
                <LinkIcon className="h-4 w-4 mr-2" />
                {!collapsed && "Linked Accounts"}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {mockAccounts.map((account) => (
                      <SidebarMenuItem key={account.id}>
                        <SidebarMenuButton className="hover:bg-accent">
                          <span className="text-lg">{account.icon}</span>
                          <span className="text-sm font-medium">{account.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <div className="px-2 pt-2">
                    <Button variant="default" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Generated Section */}
        <Collapsible open={generatedOpen} onOpenChange={setGeneratedOpen}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-accent/50 transition-colors">
                <Sparkles className="h-4 w-4 mr-2" />
                {!collapsed && "Generated"}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search generated..."
                        value={genSearch}
                        onChange={(e) => setGenSearch(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                  <SidebarMenu>
                    {mockGenerated.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton className="hover:bg-accent">
                          <div
                            className={cn(
                              "h-4 w-4 rounded border flex items-center justify-center",
                              item.generated
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            )}
                          >
                            {item.generated && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.generated ? "Generated" : "Not generated"}
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground mt-2">
                    more...
                  </Button>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Settings at bottom */}
        {!collapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-accent">
                  <Settings className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Settings</div>
                    <div className="text-xs text-muted-foreground">Account & preferences</div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
