import { NextResponse } from 'next/server'
import createClient from 'lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      let profileData = null;

      if (session?.provider_token) {
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${session.provider_token}`
          }
        })
        
        if (profileResponse.ok) {
          profileData = await profileResponse.json() // Parse the JSON
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'


      // Encode the profile data as a URL parameter
      const profileName = profileData.name;
      const pfp = profileData.picture;

      const profileParam = profileData ? encodeURIComponent(JSON.stringify(profileData)) : ''

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}/login?pfp=${pfp}&name=${profileName}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}/login?pfp=${pfp}&name=${profileName}`)
      } else {
        return NextResponse.redirect(`${origin}${next}/login?pfp=${pfp}&name=${profileName}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}