'use client'

import { useState } from 'react'
import { UsersTable } from '@/app/admin/users_table'
import { AddUserDialog } from '@/app/admin/add_user'
import { Button } from '@/components/ui/button'
import { Plus, Download, Upload, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon, MoreOrLessSquareIcon } from '@hugeicons/core-free-icons'

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6 px-4 md:px-0 mt-4">
      {/* Header Container: Forces horizontal alignment on all screens */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl truncate">
            Users
          </h1>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Manage and monitor all users on your platform
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Actions: Hidden on mobile */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Mobile Actions Dropdown: Visible on everything below LG */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 sm:border-none">
                  <HugeiconsIcon icon={MoreOrLessSquareIcon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" /> Import
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Primary Action: Icon only on very small screens, text on SM+ */}
          <Button 
            onClick={() => setShowAddUser(true)} 
            size="sm"
            className="sm:h-9 sm:px-4"
          >
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sr-only">Add User</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <UsersTable key={refresh} />
      </div>

      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onSuccess={() => setRefresh(r => r + 1)}
      />
    </div>
  )
}