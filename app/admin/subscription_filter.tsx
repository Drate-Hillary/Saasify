// // src/components/admin/subscription-filters.tsx
// 'use client'

// import { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Search, X, Calendar } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
// import { Badge } from '@/components/ui/badge'
// import { Calendar as CalendarComponent } from '@/components/ui/calendar'
// import { format } from 'date-fns'

// const statusOptions = [
//   { value: 'active', label: 'Active' },
//   { value: 'past_due', label: 'Past Due' },
//   { value: 'canceled', label: 'Canceled' },
//   { value: 'trialing', label: 'Trialing' },
//   { value: 'unpaid', label: 'Unpaid' },
// ]

// const planOptions = [
//   { value: 'free', label: 'Free' },
//   { value: 'pro', label: 'Pro' },
//   { value: 'business', label: 'Business' },
//   { value: 'enterprise', label: 'Enterprise' },
// ]

// export function SubscriptionFilters() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
  
//   const [search, setSearch] = useState(searchParams.get('search') || '')
//   const [status, setStatus] = useState<string[]>(searchParams.get('status')?.split(',') || [])
//   const [plan, setPlan] = useState<string[]>(searchParams.get('plan')?.split(',') || [])
  
//   // Added | undefined to the state type
//   const [dateRange, setDateRange] = useState<{
//     from?: Date | undefined
//     to?: Date | undefined
//   } | undefined>({
//     from: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
//     to: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
//   })

//   const applyFilters = () => {
//     const params = new URLSearchParams()
//     if (search) params.set('search', search)
//     if (status.length) params.set('status', status.join(','))
//     if (plan.length) params.set('plan', plan.join(','))
//     if (dateRange?.from) params.set('dateFrom', dateRange.from.toISOString())
//     if (dateRange?.to) params.set('dateTo', dateRange.to.toISOString())
    
//     router.push(`/admin/subscriptions?${params.toString()}`)
//   }

//   const clearFilters = () => {
//     setSearch('')
//     setStatus([])
//     setPlan([])
//     setDateRange(undefined) // Can now safely pass undefined
//     router.push('/admin/subscriptions')
//   }

//   const activeFilterCount = () => {
//     let count = 0
//     if (search) count++
//     if (status.length) count++
//     if (plan.length) count++
//     if (dateRange?.from || dateRange?.to) count++
//     return count
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by organization or subscription ID..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9"
//             onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
//           />
//         </div>

//         <Select
//           value={status.join(',')}
//           onValueChange={(value) => setStatus(value ? value.split(',') : [])}
//         >
//           <SelectTrigger className="w-45 justify-start text-left font-normal">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             {statusOptions.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select
//           value={plan.join(',')}
//           onValueChange={(value) => setPlan(value ? value.split(',') : [])}
//         >
//           <SelectTrigger className="w-45 justify-start text-left font-normal">
//             <SelectValue placeholder="Filter by plan" />
//           </SelectTrigger>
//           <SelectContent>
//             {planOptions.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" className="w-65 justify-start text-left font-normal">
//               <Calendar className="mr-2 h-4 w-4" />
//               {dateRange?.from ? (
//                 dateRange.to ? (
//                   <>
//                     {format(dateRange.from, "LLL dd, y")} -{" "}
//                     {format(dateRange.to, "LLL dd, y")}
//                   </>
//                 ) : (
//                   format(dateRange.from, "LLL dd, y")
//                 )
//               ) : (
//                 <span>Pick a date range</span>
//               )}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0" align="start">
//             <CalendarComponent
//               mode="range"
//               selected={dateRange}
//               onSelect={setDateRange}
//               numberOfMonths={2}
//             />
//           </PopoverContent>
//         </Popover>

//         <div className="flex gap-2">
//           <Button variant="outline" onClick={clearFilters}>
//             Clear
//           </Button>
//           <Button onClick={applyFilters}>
//             Apply Filters
//           </Button>
//         </div>
//       </div>

//       {activeFilterCount() > 0 && (
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="text-sm text-muted-foreground">Active filters:</span>
//           {search && (
//             <Badge variant="secondary" className="gap-1">
//               Search: {search}
//               <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearch('')} />
//             </Badge>
//           )}
//           {status.map((s) => (
//             <Badge key={s} variant="secondary" className="gap-1">
//               Status: {s}
//               <X
//                 className="ml-1 h-3 w-3 cursor-pointer"
//                 onClick={() => setStatus(status.filter(st => st !== s))}
//               />
//             </Badge>
//           ))}
//           {plan.map((p) => (
//             <Badge key={p} variant="secondary" className="gap-1">
//               Plan: {p}
//               <X
//                 className="ml-1 h-3 w-3 cursor-pointer"
//                 onClick={() => setPlan(plan.filter(pl => pl !== p))}
//               />
//             </Badge>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }