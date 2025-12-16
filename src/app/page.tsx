import { OrderListClient } from '@/components/dashboard/order-list-client';
import { orders } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Here&apos;s a list of all your current orders.
        </p>
      </div>
      <OrderListClient initialOrders={orders} />
    </div>
  );
}
