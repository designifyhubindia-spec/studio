'use client';
import { notFound, useParams } from 'next/navigation';
import { ShippingLabel } from '@/components/order/shipping-label';
import { useOrders } from '@/context/orders-context';
import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';

export default function LabelPage() {
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

  return <ShippingLabel order={order} />;
}
