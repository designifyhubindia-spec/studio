'use client';
import { notFound, useParams } from 'next/navigation';
import { OtpForm } from '@/components/delivery/otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/context/orders-context';
import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';

export default function VerifyPage() {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>
            Enter the OTP sent to {order.customerName.split(' ')[0]} at ...{order.mobileNumber.slice(-4)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm order={order} />
        </CardContent>
      </Card>
    </div>
  );
}
