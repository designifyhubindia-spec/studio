'use client';
import { OrderDetailsClient } from '@/components/order/order-details-client';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOrders } from '@/context/orders-context';
import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';

export default function OrderPage() {
  const params = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundOrder = getOrderById(params.id as string);
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [params.id, getOrderById]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
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
