import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, FileText, Info, User, Database, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Project {
  id: string;
  name: string;
  description: string;
  industry_category: string;
  stage: string;
  message_count: number;
  created_at: string;
}

interface ProjectSidebarProps {
  projectId: string;
}

const ProjectSidebar = ({ projectId }: ProjectSidebarProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      // Load project
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectData) {
        setProject(projectData);
      }

      // Load profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);
      }
    };

    loadData();
  }, [projectId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!project || !profile) {
    return (
      <div className="h-full w-64 bg-sidebar border-r border-sidebar-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const [isProfileOpen, setIsProfileOpen] = useState(true);

  const profileItems = [
    "Brand Profile",
    "Narrative",
    "Mission Statement",
    "Tone of Voice",
    "Core Values",
    "Unique Selling Points",
    "Color Scheme",
    "Logo"
  ];

  return (
    <div className="h-full w-64 bg-background border-r border-border flex flex-col">
      {/* Navigation Items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {/* Chats */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            <ChevronRight className="h-4 w-4" />
            <MessageSquare className="h-4 w-4" />
            <span>Chats</span>
          </button>

          {/* Documents */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            <ChevronRight className="h-4 w-4" />
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </button>

          {/* Info */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            <ChevronRight className="h-4 w-4" />
            <Info className="h-4 w-4" />
            <span>Info</span>
          </button>

          {/* Profile - Collapsible */}
          <Collapsible open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <CollapsibleTrigger className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              {isProfileOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <User className="h-4 w-4" />
              <span>Profile</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-1 pl-10">
              {profileItems.map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  {item}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Gathered Data */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
            <ChevronRight className="h-4 w-4" />
            <Database className="h-4 w-4" />
            <span>Gathered Data</span>
          </button>
        </nav>
      </div>

      {/* Settings at bottom */}
      <div className="border-t border-border p-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        
        <div className="mt-3 px-3 py-2 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">
              {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {profile.display_name || profile.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
