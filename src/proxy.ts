import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Redirects / to the visitor's language and maps localized pathnames (Next.js 16 "proxy").
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, Vercel internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
