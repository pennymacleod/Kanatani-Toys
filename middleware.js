import { NextResponse } from 'next/server';

// Temporary: while the website is being rebuilt (Oct 2026), every page shows
// the "coming soon" holding page in public/coming-soon/. Delete this file to
// bring the full site back.
export function middleware(req) {
  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon/index.html';
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next's own files, the API, the holding page itself and images.
  matcher: ['/((?!_next/|api/|coming-soon/|favicon\\.ico|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
