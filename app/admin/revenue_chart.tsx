// // src/components/admin/revenue-chart.tsx
// 'use client'

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Area,
//   AreaChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts'

// const data = [
//   { month: 'Jan', revenue: 4000 },
//   { month: 'Feb', revenue: 4500 },
//   { month: 'Mar', revenue: 5200 },
//   { month: 'Apr', revenue: 5800 },
//   { month: 'May', revenue: 6200 },
//   { month: 'Jun', revenue: 7100 },
//   { month: 'Jul', revenue: 8500 },
//   { month: 'Aug', revenue: 9200 },
//   { month: 'Sep', revenue: 10100 },
//   { month: 'Oct', revenue: 11200 },
//   { month: 'Nov', revenue: 12400 },
//   { month: 'Dec', revenue: 13800 },
// ]

// export function RevenueChart() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Revenue Overview</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data}>
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="hsl(var(--primary))"
//                 fillOpacity={1}
//                 fill="url(#colorRevenue)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }