import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import createClient from 'lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get user data after successful sign-in
      const { data: { user } } = await supabase.auth.getUser()
      
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Check if user already exists in the users table
      const { data: existingUser } = await supabase.from('users').select().eq('id', user.id).single()
      
      if (existingUser) {
        // User exists, redirect to dashboard
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/dashboard`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }
      
      // Extract user profile data
      const profileName = user?.user_metadata?.full_name || ''
      const pfp = user?.user_metadata?.avatar_url || '/Avatar.png'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/login?name=${encodeURIComponent(profileName)}&pfp=${encodeURIComponent(pfp)}&provider=google`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/login?name=${encodeURIComponent(profileName)}&pfp=${encodeURIComponent(pfp)}&provider=google`)
      } else {
        return NextResponse.redirect(`${origin}/login?name=${encodeURIComponent(profileName)}&pfp=${encodeURIComponent(pfp)}&provider=google`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
