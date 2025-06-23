// middleware.ts
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('jwt')?.value;
  console.log("gyuvifj",request);
  console.log("hfj",request?.cookies);
  console.log("tguirr",request?.cookies?.get('jwt'));

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
  matcher: ['/profile'],
};
