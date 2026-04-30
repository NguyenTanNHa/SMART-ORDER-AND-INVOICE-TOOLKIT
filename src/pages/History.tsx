import { useEffect, useState } from 'react'
import { getOrders, type Order } from '@/lib/db'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText } from 'lucide-react'
import { generateInvoicePDF } from '@/lib/pdf'

export default function History() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')

  const fetchOrders = (query = '') => {
    getOrders(query).then(setOrders).catch((err) => {
      console.error(err);
      // Mock data for web fallback
      setOrders([
        { id: 'mock-1', customerName: 'John Mock', phone: '1234', items: [{productName: 'Demo', quantity: 1, price: 10}], totalAmount: 10, createdAt: new Date().toISOString() }
      ])
    })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    fetchOrders(val)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
          <p className="text-muted-foreground mt-1">View and manage all past orders.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by phone number..." 
              value={search}
              onChange={handleSearch}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-slate-900">{order.id?.slice(-6).toUpperCase() || 'DRAFT'}</TableCell>
                    <TableCell className="text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone || '-'}</TableCell>
                    <TableCell>{order.items[0]?.productName || '-'}</TableCell>
                    <TableCell className="text-right">{order.items[0]?.quantity || 0}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => generateInvoicePDF(order)}>
                        <FileText className="w-3.5 h-3.5" />
                        PDF Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
