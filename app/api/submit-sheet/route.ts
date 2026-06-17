import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@supabase/supabase-js'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  export async function POST(req: NextRequest) {
    const { name, email, phone, type, profil, organisationName } = await req.json()

    const { error } = await supabase
      .from('downloads')
      .insert({ name, email, phone, type, profil, organisation_name: organisationName })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  }