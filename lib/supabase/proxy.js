import { NextResponse } from 'next/server'
import createClient from './server'

const proxy = async (request) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  const supabase = await createClient()
  await supabase.auth.getClaims()

  request.cookies.getAll().forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value)
  })

  return response
}

export default proxy

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}