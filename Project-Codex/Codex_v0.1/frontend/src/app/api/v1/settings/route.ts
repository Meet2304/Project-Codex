import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseClient';
import type { SiteSettings } from '@/lib/types';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'not_found', message: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data as SiteSettings);
  } catch (err) {
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
