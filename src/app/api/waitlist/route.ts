import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured', code: 'server_error' },
        { status: 500 }
      );
    }

    const { email, locale = 'en' } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required', code: 'invalid' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'invalid' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('waiting_list')
      .insert([{ email: email.toLowerCase().trim(), locale }])
      .select()
      .single();

    if (error) {
      // Check for duplicate email - PostgreSQL unique constraint violation
      // Can be error.code '23505' or message containing 'duplicate' or 'unique'
      const isDuplicate =
        error.code === '23505' ||
        error.message?.toLowerCase().includes('duplicate') ||
        error.message?.toLowerCase().includes('unique') ||
        error.details?.toLowerCase().includes('already exists');

      if (isDuplicate) {
        return NextResponse.json(
          { error: 'Email already registered', code: 'duplicate' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to register', code: error.code || 'server_error', details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'server_error' },
      { status: 500 }
    );
  }
}
