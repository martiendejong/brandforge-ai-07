import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingState {
  isAnonymous: boolean;
  userId: string | null;
  projectId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    isAnonymous: false,
    userId: null,
    projectId: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setState({
          isAnonymous: session.user.user_metadata?.is_anonymous || false,
          userId: session.user.id,
          projectId: localStorage.getItem('current_project_id'),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setState({
            isAnonymous: session.user.user_metadata?.is_anonymous || false,
            userId: session.user.id,
            projectId: localStorage.getItem('current_project_id'),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            isAnonymous: false,
            userId: null,
            projectId: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const startAnonymousSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('onboarding-start');
      
      if (error) throw error;

      // Set the session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) throw sessionError;

      // Store project ID
      localStorage.setItem('current_project_id', data.project.id);

      setState({
        isAnonymous: true,
        userId: data.user.id,
        projectId: data.project.id,
        isAuthenticated: true,
        isLoading: false,
      });

      return data.project.id;
    } catch (error) {
      console.error('Failed to start anonymous session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please refresh and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const convertToRegisteredUser = async (newUserId: string) => {
    if (!state.userId || !state.projectId) return;

    try {
      await supabase.functions.invoke('convert-user', {
        body: {
          anonymous_user_id: state.userId,
          new_user_id: newUserId,
          project_id: state.projectId,
        }
      });

      // Name the project with AI
      await supabase.functions.invoke('name-project', {
        body: { project_id: state.projectId }
      });

      setState(prev => ({
        ...prev,
        isAnonymous: false,
        userId: newUserId,
      }));

      toast({
        title: "Welcome!",
        description: "Your account has been created and your project is ready.",
      });
    } catch (error) {
      console.error('Failed to convert user:', error);
      toast({
        title: "Error",
        description: "Failed to complete signup. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    ...state,
    startAnonymousSession,
    convertToRegisteredUser,
  };
};
