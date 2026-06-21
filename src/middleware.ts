import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const res = NextResponse.next()
    if (isLoginPage) res.headers.set('x-admin-login', '1')
    return res
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!isLoginPage && !user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }

    if (isLoginPage && user) {
      const dashUrl = request.nextUrl.clone()
      dashUrl.pathname = '/admin'
      return NextResponse.redirect(dashUrl)
    }
  } catch {
    if (!isLoginPage) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // Login sayfasına özel header ekle
  if (isLoginPage) {
    supabaseResponse.headers.set('x-admin-login', '1')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
