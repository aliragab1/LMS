// import arcjet, { createMiddleware, detectBot } from '@arcjet/next';
// import { env } from '@/lib/env';
// import { NextRequest, NextResponse } from 'next/server';
// import { getSessionCookie } from 'better-auth/cookies';

// const aj = arcjet({
//   key: env.ARCJET_KEY,
//   rules: [
//     detectBot({
//       mode: 'LIVE',
//       allow: [
//         'CATEGORY:SEARCH_ENGINE',
//         'CATEGORY:MONITOR',
//         'CATEGORY:PREVIEW',
//         'STRIPE_WEBHOOK',
//       ],
//     }),
//   ],
// });

// // Routes that require authentication
// const protectedRoutes = ['/admin'];
// // Routes that should redirect to home if already authenticated
// const authRoutes = ['/login'];
// // Routes that don't need auth checks
// const publicRoutes = ['/', '/courses', '/verify-request'];

// async function authMiddleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isAuthRoute = authRoutes.includes(pathname);
//   const isPublicRoute = publicRoutes.includes(pathname);

//   // Skip auth check for public routes
//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   const sessionCookie = getSessionCookie(request);

//   // Redirect to login if trying to access protected route without session
//   if (isProtectedRoute && !sessionCookie) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // Redirect to home if trying to access auth routes while authenticated
//   if (sessionCookie && isAuthRoute) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Exclude static assets, API routes (except auth), and Next.js internals
//   matcher: [
//     // '/((?!_next/static|_next/image|favicon.ico|api/(?!auth)|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
//   ],
// };

// export default createMiddleware(aj, async (req: NextRequest) => {
//   // Run auth middleware for all matched routes
//   return authMiddleware(req);
// });

// middleware

import arcjet, { createMiddleware, detectBot } from '@arcjet/next';
import { env } from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const aj = arcjet({
  key: env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: 'LIVE', // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        'CATEGORY:MONITOR', // Uptime monitoring services
        'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
        'STRIPE_WEBHOOK',
      ],
    }),
  ],
});

async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return authMiddleware(req);
  }
  return NextResponse.next();
});
