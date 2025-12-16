import { OrderListClient } from '@/components/dashboard/order-list-client';
import { orders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Here&apos;s a list of all your current orders.
          </p>
        </div>
        <Button asChild>
          <Link href="/order/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Link>
        </Button>
      </div>
      <OrderListClient initialOrders={orders} />
    </div>
  );
}
