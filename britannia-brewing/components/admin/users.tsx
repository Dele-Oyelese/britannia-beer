// pages/admin / users.tsx
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { AdminNav } from '@/components/admin/admin-nav'
import { ProtectedRoute } from '@/components/admin/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  created_at: string
  updated_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState<'admin' | 'super_admin'>('admin')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const { data, error } = await auth.createAdmin(newUserEmail, newUserPassword, newUserRole)

      if (error) {
        setError(error.message)
      } else {
        setNewUserEmail('')
        setNewUserPassword('')
        setNewUserRole('admin')
        setShowAddForm(false)
        loadUsers()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) throw error
      loadUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  return (
    <ProtectedRoute requireSuperAdmin>
      <Head>
        <title>User Management - Britannia Brewing</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminNav />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-britannia-navy">User Management</h1>
                <p className="text-gray-600">Manage admin access to the system</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add New User'}
              </Button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-britannia-navy">Add New Admin User</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Email Address"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                      />

                      <Input
                        label="Password"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        required
                        minLength={6}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'super_admin')}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-britannia-navy"
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" isLoading={formLoading}>
                        Create User
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Users List */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-britannia-navy">Current Users</h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Created {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value as 'admin' | 'super_admin')}
                            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-britannia-navy"
                          >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>

                          <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'super_admin'
                            ? 'bg-britannia-gold text-britannia-navy'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
