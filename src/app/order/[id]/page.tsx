import { orders } from '@/lib/data';
import { OrderDetailsClient } from '@/components/order/order-details-client';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type OrderPageProps = {
  params: { id: string };
};

export default function OrderPage({ params }: OrderPageProps) {
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
      </div>
      <OrderDetailsClient order={order} />
    </div>
  );
}
