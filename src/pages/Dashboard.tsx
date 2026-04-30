import { useEffect, useState } from 'react'
import { getOrders } from '@/lib/db'
import { FileText, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0 })

  useEffect(() => {
    // Only load data if running inside Tauri (tauri-plugin-sql needs native backend)
    getOrders().then(data => {
      const revenue = data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      setStats({ totalOrders: data.length, revenue })
    }).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your online retailer business.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold mt-1">
              ${(stats.revenue).toLocaleString()}
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-full text-green-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Average Order</p>
            <h3 className="text-2xl font-bold mt-1">
              ${stats.totalOrders > 0 ? (stats.revenue / stats.totalOrders).toFixed(2) : 0}
            </h3>
          </div>
          <div className="bg-purple-50 p-3 rounded-full text-purple-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Growth</p>
            <h3 className="text-2xl font-bold mt-1">+12.5%</h3>
          </div>
          <div className="bg-orange-50 p-3 rounded-full text-orange-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
