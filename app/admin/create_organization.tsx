'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Loader2, PlusCircle } from 'lucide-react'
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
          <Button size="sm" className="h-8 px-2 sm:h-9 sm:px-4">
            <PlusCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create</span>
            <span className="sr-only">Create Organization</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleOpenDialog} className="cursor-pointer">
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
        {/* Responsive Dialog: Full width on mobile, capped on Desktop */}
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-2xl">Create organization</DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              Add a new organization to your workspace. A unique slug will be generated
              automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-0">
              <Label htmlFor="organization-name" className="text-sm font-semibold">
                Organization Name
              </Label>
              <Input
                id="organization-name"
                placeholder="Acme Inc"
                className="h-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-0">
              <Label htmlFor="organization-logo" className="text-sm font-semibold">
                Logo URL (Optional)
              </Label>
              <Input
                id="organization-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                className="h-10"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 sm:space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-10 sm:h-10"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 sm:h-10" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}