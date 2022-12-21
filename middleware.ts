// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// This function can be marked `async` if using `await` inside
export default withAuth(
  function middleware(request) {
    console.log(request);
    return NextResponse.rewrite(new URL(request.url));
  },
  {
    callbacks: {
      authorized({ token }) {
        return token?.role === 'admin';
      }
    }
  }
);

export const config = {
  matcher: ['/admin/:path*']
};
