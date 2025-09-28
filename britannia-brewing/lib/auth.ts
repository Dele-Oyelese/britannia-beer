// lib/auth.ts
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface Profile {
  id: string
  email: string
  role: 'admin' | 'super_admin'
}

export const auth = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getUser(): Promise<{ user: User | null; error: any }> {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get user profile with role
  async getProfile(userId: string): Promise<{ profile: Profile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return { profile: data, error }
  },

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    const { user } = await this.getUser()
    if (!user) return false

    const { profile } = await this.getProfile(user.id)
    return profile?.role === 'admin' || profile?.role === 'super_admin'
  },

  // Create admin user (super admin only)
  async createAdmin(email: string, password: string, role: 'admin' | 'super_admin' = 'admin') {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error || !data.user) return { data: null, error }

    // Update the profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', data.user.id)

    return { data, error: profileError }
  }
}
