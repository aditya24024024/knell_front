import { NextResponse } from 'next/server'
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const token=request?.cookies?.get('jwt')?.value;
  if(!token){
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirected', 'true');
    return NextResponse.redirect(url);
  }
}
 
export const config = {
  matcher: ['/profile','/logout','/seller/:path*','/buyer/:path*']
}
