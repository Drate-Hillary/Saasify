'use server'

import { createClient } from '@/lib/supabase/server'

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset_password`,
  })
  if (error) return { error: error.message }
  return { success: true }
}
