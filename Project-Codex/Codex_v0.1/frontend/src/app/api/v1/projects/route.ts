import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import type { Project } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort');

    const supabase = createServerSupabaseClient();
    let query = supabase
      .from('project')
      .select(`
        *,
        tags:project_tag(tag:tag(*))
      `)
      .eq('published', true);

    if (tag) {
      query = query.contains('tags', [{ tag: { name: tag } }]);
    }

    if (sort === 'recency') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data as Project[]);
  } catch (err) {
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
