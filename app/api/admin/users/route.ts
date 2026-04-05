import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '10')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        organization_members (
          role,
          organizations ( name )
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    const users = data?.map((u) => ({
      id: u.id,
      name: u.name ?? 'Unknown',
      email: u.email,
      avatar: u.avatar_url ?? '',
      role: u.organization_members?.[0]?.role ?? 'member',
      organization: u.organization_members?.[0]?.organizations?.name ?? '—',
      status: u.status ?? 'active',
      createdAt: u.created_at,
      lastActive: u.updated_at,
    }))

    return NextResponse.json({ data: users, total: count ?? 0 })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, action } = await req.json()

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action are required' }, { status: 400 })
    }

    const updateData: { status?: 'active' | 'suspended' } = {}
    let auditAction = ''

    if (action === 'suspend') {
      updateData.status = 'suspended'
      auditAction = 'user_suspended'
    } else if (action === 'unsuspend') {
      updateData.status = 'active'
      auditAction = 'user_unsuspended'
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) throw error

    // Log the action
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: auditAction,
        metadata: { action, performed_by: 'admin' }
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) throw error

    // Log the action
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'user_deleted',
        metadata: { performed_by: 'admin' }
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Create auth user and send invite email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name, role },
    })

    if (authError) throw authError

    // Insert into users table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({ id: authData.user.id, email, name })

    if (dbError) throw dbError

    return NextResponse.json({ user: authData.user })
  } catch (error) {
    console.error('Failed to add user:', error)
    const message = error instanceof Error ? error.message : 'Failed to add user'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
