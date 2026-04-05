'use client'

import { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreHorizontal, Eye, Shield, Ban, Trash, Mail, Key } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

type User = {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'suspended'
  organization: string
  createdAt: string
  lastActive: string
  avatar: string
}

const roleVariants: Record<User['role'], 'destructive' | 'default' | 'secondary'> = {
  owner: 'destructive',
  admin: 'secondary',
  member: 'default',
}

export function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [impersonateUser, setImpersonateUser] = useState<User | null>(null)
  const [suspendUser, setSuspendUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      setData(result.data ?? [])
    } catch {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async (user: User) => {
    try {
      const action = user.status === 'active' ? 'suspend' : 'unsuspend'
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action }),
      })

      if (!response.ok) throw new Error('Failed to update user')

      toast.success(`User ${action === 'suspend' ? 'suspended' : 'unsuspended'} successfully`)
      setSuspendUser(null)
      fetchUsers() // Refresh the data
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const handleDeleteUser = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete user')

      toast.success('User deleted successfully')
      setDeleteUser(null)
      fetchUsers() // Refresh the data
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={roleVariants[row.original.role]} className="capitalize">{row.original.role}</Badge>
      ),
    },
    { accessorKey: 'organization', header: 'Organization' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Active',
      cell: ({ row }) => format(new Date(row.original.lastActive), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" /> View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" /> Send email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Key className="mr-2 h-4 w-4" /> Reset password
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setImpersonateUser(user) }}>
                <Shield className="mr-2 h-4 w-4" /> Impersonate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={user.status === 'active' ? 'text-yellow-600' : 'text-green-600'}
                onClick={() => setSuspendUser(user)}
              >
                <Ban className="mr-2 h-4 w-4" />
                {user.status === 'active' ? 'Suspend user' : 'Unsuspend user'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => setDeleteUser(user)}>
                <Trash className="mr-2 h-4 w-4" /> Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <Dialog open={!!impersonateUser} onOpenChange={() => setImpersonateUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              You are about to impersonate <strong>{impersonateUser?.name}</strong> ({impersonateUser?.email}). This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpersonateUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setImpersonateUser(null)}>
              Confirm Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!suspendUser} onOpenChange={() => setSuspendUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{suspendUser?.status === 'active' ? 'Suspend' : 'Unsuspend'} User</DialogTitle>
            <DialogDescription>
              Are you sure you want to {suspendUser?.status === 'active' ? 'suspend' : 'unsuspend'}{' '}
              <strong>{suspendUser?.name}</strong> ({suspendUser?.email})?{' '}
              {suspendUser?.status === 'active'
                ? 'The user will lose access to their account until unsuspended.'
                : 'The user will regain access to their account.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendUser(null)}>Cancel</Button>
            <Button
              variant={suspendUser?.status === 'active' ? 'destructive' : 'default'}
              onClick={() => suspendUser && handleSuspendUser(suspendUser)}
            >
              Confirm {suspendUser?.status === 'active' ? 'Suspension' : 'Unsuspension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteUser?.name}</strong> ({deleteUser?.email})?{' '}
              This action cannot be undone. The user will be permanently removed from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteUser && handleDeleteUser(deleteUser)}>
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
