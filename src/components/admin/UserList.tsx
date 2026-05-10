'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface User {
  id: string
  profile_type: string
  created_at: string
  risk_personality_score: number
  emotional_stability_score: number
}

interface UserListProps {
  users: User[]
}

const PROFILE_COLORS: Record<string, string> = {
  sniper: 'bg-red-100 text-red-800',
  analyst: 'bg-blue-100 text-blue-800',
  warrior: 'bg-orange-100 text-orange-800',
  disciplinarian: 'bg-green-100 text-green-800',
  opportunist: 'bg-purple-100 text-purple-800',
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No users created yet. Create your first user above!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">User ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Profile Type</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Risk Score</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Stability</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-700">
                    {user.id.substring(0, 8)}...
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        PROFILE_COLORS[user.profile_type] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.profile_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#00B4D8] h-2 rounded-full"
                          style={{ width: `${user.risk_personality_score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{user.risk_personality_score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${user.emotional_stability_score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{user.emotional_stability_score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
