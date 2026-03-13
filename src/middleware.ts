import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except api, admin, uploads, _next, and static files
    "/((?!api|admin|uploads|_next|.*\\..*).*)",
  ],
};
