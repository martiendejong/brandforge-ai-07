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
    
    const { anonymous_user_id, new_user_id, project_id } = await req.json();

    console.log('Converting user:', { anonymous_user_id, new_user_id, project_id });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Transfer project ownership
    const { error: projectError } = await supabase
      .from('projects')
      .update({ user_id: new_user_id })
      .eq('id', project_id)
      .eq('user_id', anonymous_user_id);

    if (projectError) {
      console.error('Project transfer error:', projectError);
      throw new Error('Failed to transfer project');
    }

    // Update all chat messages to new user
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .update({ user_id: new_user_id })
      .eq('project_id', project_id)
      .eq('user_id', anonymous_user_id);

    if (messagesError) {
      console.error('Messages transfer error:', messagesError);
    }

    // Mark anonymous user as converted
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        user_type: 'converted',
        converted_from_user_id: new_user_id
      })
      .eq('id', anonymous_user_id);

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    console.log('User conversion completed successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'User converted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in convert-user:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
