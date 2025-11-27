import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Folder, Calendar, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

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

  return (
    <div className="h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <Logo size="small" />
          <h2 className="text-lg font-bold">
            Brand<span className="text-gradient-primary">Forge</span>
          </h2>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-sidebar-foreground">
            {profile.display_name || profile.username}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Folder className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Project</h3>
          </div>
          <p className="text-sm font-medium mb-2">{project.name || 'Unnamed Project'}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {project.description || 'No description yet'}
          </p>
        </div>

        {project.industry_category && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-category" />
              <h3 className="font-semibold text-sm">Industry</h3>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-category/10 text-category text-xs font-medium">
              {project.industry_category}
            </span>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-sm">Progress</h3>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>Messages: {project.message_count}</p>
            <p>Stage: {project.stage.replace('_', ' ')}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Created</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(project.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
