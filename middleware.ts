import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  const path = req.nextUrl.pathname;
  const loginPage = path.startsWith("/auth/login");

  const isAuth = await getToken({ req });
  const sensibleRoutes = ["/chats"];

  const isAccessinsensibleRoute = sensibleRoutes.some((route) =>
    path.startsWith(route)
  );

  if (loginPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/chats", req.url));
    }

    return NextResponse.next();
  }

  if (!isAuth && isAccessinsensibleRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
},{
  callbacks: {
    async authorized(){
      return true
    }
  },
});

export const config = {
  matcher: ["/chats/:path*", "/auth/:path*"],
};
