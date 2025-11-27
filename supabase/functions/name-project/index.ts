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

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('project_id', project_id)
      .order('created_at', { ascending: true });

    if (!messages || messages.length === 0) {
      throw new Error('No conversation history found');
    }

    // Use AI to generate project name and metadata
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
            content: `You are an AI that generates project metadata for branding projects. Based on the conversation, create:
1. A compelling project name (2-5 words, professional)
2. A brief description (1-2 sentences)
3. Industry category (e.g., "Food & Beverage", "Technology", "Healthcare", "Retail", etc.)
4. Key conversation topics (array of 3-5 topics)
5. Key brand insights (array of 2-3 insights)

Respond with ONLY a JSON object in this exact format:
{
  "name": "Project Name",
  "description": "Brief description of the brand",
  "industry_category": "Industry Category",
  "conversation_topics": ["topic1", "topic2", "topic3"],
  "key_insights": ["insight1", "insight2"]
}`
          },
          {
            role: 'user',
            content: `Analyze this branding conversation and generate project metadata:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate project name');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '{}';
    
    let metadata;
    try {
      metadata = JSON.parse(aiContent);
    } catch {
      // Fallback metadata
      metadata = {
        name: 'Brand Identity Project',
        description: 'A new brand identity project',
        industry_category: 'General',
        conversation_topics: ['branding', 'identity'],
        key_insights: ['User wants to build a brand']
      };
    }

    // Update project with AI-generated metadata
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        name: metadata.name,
        description: metadata.description,
        industry_category: metadata.industry_category,
        conversation_topics: metadata.conversation_topics,
        key_insights: metadata.key_insights,
        stage: 'completed'
      })
      .eq('id', project_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ project: updatedProject }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in name-project:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
