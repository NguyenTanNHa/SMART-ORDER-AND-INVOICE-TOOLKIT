import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createOrder } from '@/lib/db'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PackageOpen } from 'lucide-react'
import { generateInvoicePDF } from '@/lib/pdf'

const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  productName: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
})

type OrderFormValues = z.infer<typeof orderSchema>

const generateOrderId = () => {
  const date = new Date()
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `${yy}${mm}${dd}-${random}`
}

export default function CreateOrder() {
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      price: undefined,
    }
  })

  const onSubmit = async (data: OrderFormValues) => {
    const orderData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail || undefined,
      phone: data.phone || undefined,
      items: [{
        productName: data.productName,
        quantity: data.quantity,
        price: data.price,
      }],
      totalAmount: data.quantity * data.price,
    }

    try {
      const now = new Date();
      if (window.__TAURI_INTERNALS__) {
        await createOrder(orderData)
        generateInvoicePDF({ id: now.getTime().toString(), ...orderData, createdAt: now.toISOString() })
        
        toast.success("Order Saved & PDF Generated!")
        navigate('/history')
      } else {
        await createOrder(orderData)
        generateInvoicePDF({ id: now.getTime().toString(), ...orderData, createdAt: now.toISOString() })
        toast.success("Web Mode: Order Saved & PDF Generated!")
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      toast.error(`Error saving order: ${errorMsg}`)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Create Order</h2>
        <p className="text-muted-foreground mt-1">Enter order details below.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <PackageOpen className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg">Order Details</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Customer Name *</label>
              <Input 
                autoFocus
                placeholder="e.g. John Doe"
                {...register("customerName")}
              />
              {errors.customerName && <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Customer Email</label>
              <Input 
                type="email"
                placeholder="e.g. john@example.com"
                {...register("customerEmail")}
              />
              {errors.customerEmail && <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Phone</label>
              <Input 
                placeholder="e.g. +1 234 567 890"
                {...register("phone")}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Product *</label>
              <Input 
                placeholder="e.g. Mechanical Keyboard"
                {...register("productName")}
              />
              {errors.productName && <p className="text-sm text-red-500 mt-1">{errors.productName.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Quantity</label>
                <Input 
                  type="number" min={1}
                  {...register("quantity")}
                />
                {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700">Price *</label>
                <Input 
                  type="number" step="0.01"
                  placeholder="0.00"
                  {...register("price")}
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Save & Print
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
