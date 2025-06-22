import { NextResponse } from 'next/server'
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const token=request?.cookies?.get('jwt')?.value;
  console.log("req:",request);
  console.log("cookies:",request.cookies);
  if(!token){
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirected', 'true');
    return NextResponse.redirect(url);
  }
}
 
export const config = {
  matcher: ['/profile','/logout','/admin','/seller/:path*','/buyer/:path*']
}
