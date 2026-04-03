import React from 'react'
import { SidebarInset, SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'

export const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset></SidebarInset>
    </SidebarProvider>
  )
}
