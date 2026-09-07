import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req) {
  const res = NextResponse.next();
  
  // Since we use the basic @supabase/supabase-js, session management in App Router 
  // without @supabase/ssr usually relies on checking cookies manually.
  // Here we do a basic implementation checking for a known cookie or token.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    }
  });

  // Check if there's a token in the cookies or Authorization header
  // This is a simplified check. A full implementation would parse cookies.
  const token = req.cookies.get('sb-access-token')?.value;

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');

  if (!token && !isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // If token exists, we could verify it using supabase.auth.getUser(token)
  // But doing network requests in middleware can be slow. 
  // For basic protection, checking token presence is a start.

  if (token && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
