'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface UserObj {
  id: string
  full_name: string | null
  email: string
  created_at: string
}

export function UserList({ users, type }: { users: UserObj[], type: 'trainer' | 'member' }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const colorClass = type === 'trainer' ? 'red' : 'blue'

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you absolutely sure you want to permanently delete ${name}? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Successfully deleted ${type}`)
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (err) {
      toast.error('Network error while deleting user')
    }
    setDeletingId(null)
  }

  if (users.length === 0) {
    return <div className="text-center py-8 text-zinc-600 text-sm">No {type}s yet</div>
  }

  return (
    <div className={`space-y-2 ${type === 'member' ? 'max-h-72 overflow-y-auto pr-1' : ''}`}>
      {users.map(u => (
        <div key={u.id} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl group relative overflow-hidden">
          <div className={`w-8 h-8 rounded-full bg-${colorClass}-600/20 flex items-center justify-center text-${colorClass}-400 font-bold text-sm shrink-0`}>
            {(u.full_name || u.email || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{u.full_name || 'Unnamed'}</p>
            <p className="text-xs text-zinc-500 truncate">{u.email}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 shrink-0">
              {new Date(u.created_at).toLocaleDateString('en-GB')}
            </span>
            
            <button
              onClick={() => handleDelete(u.id, u.full_name || u.email)}
              disabled={deletingId === u.id}
              className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
              title={`Delete ${type}`}
            >
              {deletingId === u.id ? (
                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
