import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import type { Principle } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('principle')
      .select('*')
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data as Principle[]);
  } catch (err) {
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
