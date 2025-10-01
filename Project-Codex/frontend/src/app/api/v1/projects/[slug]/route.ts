import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import type { ProjectDetail } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('project')
      .select(`
        *,
        tags:project_tag(tag:tag(*))
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'not_found', message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data as ProjectDetail);
  } catch (err) {
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
