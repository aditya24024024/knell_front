// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log("gyuvifj",request);
  console.log("hfj",request?.cookies);
  console.log("tguirr",request?.cookies?.get('token'));

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // try {
  //   await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
  //   return NextResponse.next();
  // } catch (e) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
}

export const config = {
  matcher: ['/profile'], // protect these routes
};
