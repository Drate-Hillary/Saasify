'use client'

import { useState } from 'react'
import { UsersTable } from '@/app/admin/users_table'
import { AddUserDialog } from '@/app/admin/add_user'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload } from 'lucide-react'

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddUser(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <UsersTable key={refresh} />

      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onSuccess={() => setRefresh(r => r + 1)}
      />
    </div>
  )
}
