import { supabase } from './supabase'

export interface AdminUser {
  id: string
  email: string
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .eq('email', email)
    .single()

  if (error || !data) {
    return null
  }

  // Em produção, use bcrypt.compare()
  if (data.password_hash === password) {
    return { id: data.id, email: data.email }
  }

  return null
}

export function setAdminSession(user: AdminUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_user', JSON.stringify(user))
  }
}

export function getAdminSession(): AdminUser | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('admin_user')
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_user')
  }
}
