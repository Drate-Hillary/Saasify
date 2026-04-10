'use client'

import { useEffect, useState } from 'react'
import { Bell, Search, Settings, User, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SidebarTrigger } from './ui/sidebar'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Memoji from '@/public/Memoji-18.png'
import { HugeiconsIcon } from "@hugeicons/react"
import { LogoutIcon } from "@hugeicons/core-free-icons"

export function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string,
    email: string,
    avatar: string,
  } | null>(null);
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, title: 'New user registered', time: '5 min ago', read: false },
    { id: 2, title: 'Payment failed', time: '1 hour ago', read: false },
    { id: 3, title: 'Subscription renewed', time: '2 hours ago', read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(()=> {
      const getUserData = async() => {
        const {data: {user: authUser}} = await supabase.auth.getUser()
  
        if(authUser){
          setUser({
            name: authUser.user_metadata.full_name || authUser.email?.split('@')[0] || "User",
            email: authUser.email || "",
            avatar: authUser.user_metadata.avatar_url || "",
          });
        }
      };
  
      getUserData();
    }, [supabase]);
  
    const handleLogout = async () => {
      const {error} = await supabase.auth.signOut();
      if (error) {
        toast.error("Error Logging out.")
      }
      toast.success("Logged out Successfully");
      router.push("/");
      router.refresh();
    }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation='vertical' />
      <div className="flex flex-1 items-center gap-4">
        {/* Desktop Search: Hidden on mobile */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-muted/50 focus-visible:bg-background transition-colors"
          />
        </div>

        <div className={cn(
          "absolute inset-x-0 top-0 z-50 flex h-16 items-center bg-background px-4 md:hidden transition-all duration-200",
          isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}>
          <div className="flex w-full items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="flex-1 border-none bg-transparent focus-visible:ring-0 text-base" 
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && <Badge variant="secondary" className="text-[10px]">New</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || Memoji.src} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
              <HugeiconsIcon icon={LogoutIcon} className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}