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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { project_id, message, messages } = await req.json();

    console.log('Chat request for project:', project_id, 'user:', user.id);

    // Verify user owns this project
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      throw new Error('Project not found or unauthorized');
    }

    // Save user message
    if (message) {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          project_id,
          user_id: user.id,
          role: 'user',
          content: message
        });

      if (msgError) {
        console.error('Error saving user message:', msgError);
      }

      // Update project message count
      await supabase
        .from('projects')
        .update({ 
          message_count: project.message_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', project_id);
    }

    // Get conversation history
    const { data: conversationHistory } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true });

    const allMessages = [
      {
        role: 'system',
        content: `You are BrandForge AI, an expert branding assistant. Help users create compelling brand identities by:
1. Understanding their business idea, target audience, and unique value proposition
2. Asking thoughtful questions to uncover their brand essence
3. Providing strategic guidance on naming, positioning, and visual identity
4. Being conversational, encouraging, and insightful
5. Keeping responses concise but impactful

Current project stage: ${project.stage}
Industry: ${project.industry_category || 'Not yet determined'}`
      },
      ...(conversationHistory || []),
      ...(message ? [{ role: 'user', content: message }] : [])
    ];

    // Stream response from Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: allMessages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error('AI gateway error');
    }

    // Stream response back to client
    return new Response(aiResponse.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
