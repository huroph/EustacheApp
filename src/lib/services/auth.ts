// src/lib/services/auth.ts
import { supabase } from '@/lib/supabase'

export type SignUpResult = Awaited<ReturnType<typeof supabase.auth.signUp>>

export async function signUp(email: string, password: string, role: string) {
  // Supabase v2: pass user metadata inside options
  return await supabase.auth.signUp({ email, password, options: { data: { role } } })
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session))
}

export function getUserRole(user: any): string | null {
  return (user && (user.user_metadata as any)?.role) || null
}
