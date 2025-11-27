import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate random username for anonymous user
    const randomId = crypto.randomUUID().split('-')[0];
    const anonymousEmail = `anon_${randomId}@brandforge.temp`;
    const anonymousPassword = crypto.randomUUID();
    const anonymousUsername = `anon_${randomId}`;

    console.log('Creating anonymous user:', anonymousUsername);

    // Create anonymous user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: anonymousEmail,
      password: anonymousPassword,
      email_confirm: true,
      user_metadata: {
        username: anonymousUsername,
        display_name: `Anonymous User`,
        is_anonymous: true
      }
    });

    if (authError || !authData.user) {
      console.error('Auth error:', authError);
      throw new Error(authError?.message || 'Failed to create anonymous user');
    }

    console.log('Anonymous user created:', authData.user.id);

    // Create profile for anonymous user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: anonymousUsername,
        display_name: 'Anonymous User',
        user_type: 'anonymous'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw new Error('Failed to create profile');
    }

    console.log('Profile created for user:', authData.user.id);

    // Create special onboarding project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: authData.user.id,
        name: null,
        description: null,
        stage: 'chat_started',
        is_special_onboarding: true
      })
      .select()
      .single();

    if (projectError || !project) {
      console.error('Project creation error:', projectError);
      throw new Error('Failed to create project');
    }

    console.log('Project created:', project.id);

    // Create session for anonymous user by signing them in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: anonymousEmail,
      password: anonymousPassword
    });

    if (signInError || !signInData.session) {
      console.error('Sign in error:', signInError);
      throw new Error('Failed to create session');
    }

    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          email: anonymousEmail,
        },
        project: {
          id: project.id,
          stage: project.stage
        },
        session: {
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          expires_at: signInData.session.expires_at
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in onboarding-start:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
