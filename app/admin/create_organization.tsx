'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ChevronDown, Loader2, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateOrganizationDropdownProps {
  onSuccess?: () => void
}

export function CreateOrganizationDropdown({
  onSuccess,
}: CreateOrganizationDropdownProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = () => {
    setName('')
    setLogo('')
  }

  const handleOpenDialog = () => {
    setMenuOpen(false)
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, logo }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create organization')
      }

      toast.success('Organization created successfully')
      window.dispatchEvent(new Event('organizations:refresh'))
      resetForm()
      setDialogOpen(false)
      onSuccess?.()
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create organization')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Organization
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleOpenDialog}>
            <Building2 className="mr-2 h-4 w-4" />
            New organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open && !isLoading) {
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a new organization to your workspace. A unique slug will be generated
              automatically from the organization name.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization-logo">Logo URL</Label>
              <Input
                id="organization-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create organization
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
