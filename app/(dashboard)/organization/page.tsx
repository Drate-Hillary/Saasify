import { Suspense } from "react";
import { OrganizationsTable } from "@/app/admin/organization_filter";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateOrganizationDropdown } from "@/app/admin/create_organization";

export default function OrganizationsPage() {
  return (
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl truncate">
            Organizations
          </h1>
          <p className="text-sm text-muted-foreground sm:block truncate">
            Manage all organizations and their settings
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="sm:flex h-8 sm:h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </Button>
          <div className="h-8 sm:h-9">
            <CreateOrganizationDropdown />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <OrganizationsTable />
        </Suspense>
      </div>
    </div>
  );
}