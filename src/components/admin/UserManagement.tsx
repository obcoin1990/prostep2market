'use client'

import { useState, useEffect } from 'react'
import { Loader, Plus, Users, Mail, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateUserForm } from './CreateUserForm'
import { UserList } from './UserList'

interface User {
  id: string
  profile_type: string
  created_at: string
  email?: string
  risk_personality_score: number
  emotional_stability_score: number
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch users')
        return
      }

      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUserCreated = () => {
    setShowForm(false)
    fetchUsers()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A0F1C]">User Management</h1>
          <p className="text-[rgba(10,15,28,0.6)] mt-1">Create and manage demo users</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Hide Form' : 'Create User'}
        </Button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="animate-slide-in-up">
          <CreateUserForm onSuccess={handleUserCreated} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-[#00B4D8]">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-300 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analysts</p>
                <p className="text-3xl font-bold text-[#00B4D8]">
                  {users.filter(u => u.profile_type === 'analyst').length}
                </p>
              </div>
              <UserIcon className="w-8 h-8 text-cyan-300 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Other Profiles</p>
                <p className="text-3xl font-bold text-[#00B4D8]">
                  {users.filter(u => u.profile_type !== 'analyst').length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-teal-300 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-[#00B4D8] animate-spin" />
        </div>
      ) : (
        <UserList users={users} />
      )}
    </div>
  )
}
