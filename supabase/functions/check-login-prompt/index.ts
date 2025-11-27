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

    const { project_id } = await req.json();

    // Get project details
    const { data: project } = await supabase
      .from('projects')
      .select('*, chat_messages(count)')
      .eq('id', project_id)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    // Check if already prompted
    if (project.stage !== 'chat_started') {
      return new Response(
        JSON.stringify({ shouldPrompt: false, reason: 'Already prompted or completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get recent messages
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!messages || messages.length < 3) {
      return new Response(
        JSON.stringify({ shouldPrompt: false, reason: 'Not enough conversation yet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to decide if we have enough brand context
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes branding conversations. Determine if we have gathered enough information about the user's brand to ask them to create an account. We need at least:
1. Basic business idea or concept
2. Target audience or market
3. Some sense of brand personality or values

Respond with ONLY a JSON object: {"shouldPrompt": true/false, "reason": "brief explanation", "confidence": 0-100}`
          },
          {
            role: 'user',
            content: `Conversation history (most recent first):\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}\n\nShould we prompt for login/signup now?`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI gateway error:', aiResponse.status);
      // Fallback to message count rule
      return new Response(
        JSON.stringify({ 
          shouldPrompt: messages.length >= 5,
          reason: 'Fallback to message count rule',
          confidence: 70
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '{}';
    
    let decision;
    try {
      decision = JSON.parse(aiContent);
    } catch {
      // If AI doesn't return valid JSON, fallback to rule-based
      decision = {
        shouldPrompt: messages.length >= 5,
        reason: 'AI response parsing failed, using fallback',
        confidence: 60
      };
    }

    // Update project stage if prompting
    if (decision.shouldPrompt) {
      await supabase
        .from('projects')
        .update({ stage: 'login_prompted' })
        .eq('id', project_id);
    }

    return new Response(
      JSON.stringify(decision),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in check-login-prompt:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
