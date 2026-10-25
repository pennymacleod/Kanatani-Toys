import { NextResponse } from 'next/server';

// Temporary: while the website is being rebuilt (Oct 2026), every page shows
// the holding page. Delete this file to bring the full site back.
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/holding') return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/holding';
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next's own files, the API and images in /public.
  matcher: ['/((?!_next/|api/|favicon\\.ico|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
