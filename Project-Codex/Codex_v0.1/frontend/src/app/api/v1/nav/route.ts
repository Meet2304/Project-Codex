import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import type { NavItem } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('nav_item')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data as NavItem[]);
  } catch (err) {
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
