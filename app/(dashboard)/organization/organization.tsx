import { OrganizationsTable } from "@/app/admin/organization_table"
import { Button } from '@/components/ui/button'
import { Building2, Plus, Download } from 'lucide-react'

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all organizations and their settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>
      </div>

      <OrganizationsTable />
    </div>
  )
}