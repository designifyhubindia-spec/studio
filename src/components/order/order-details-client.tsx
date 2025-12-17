'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FileText, QrCode, Trash2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { OrderStatusBadge } from '../dashboard/order-status-badge';
import { AiInsights } from './ai-insights';
import { useOrders } from '@/context/orders-context';
import { useToast } from '@/hooks/use-toast';

type OrderDetailsClientProps = {
  order: Order;
};

export function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const router = useRouter();
  const { deleteOrder } = useOrders();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteOrder(order.id);
    toast({
      title: 'Order Deleted',
      description: `Order ${order.id} has been removed.`,
    });
    router.push('/');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Order ID: {order.id}</CardTitle>
                <CardDescription>
                  Product: {order.productName} (x{order.quantity})
                </CardDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Customer" value={order.customerName} />
              <InfoItem label="Mobile Number" value={order.mobileNumber} />
            </div>
            <InfoItem label="Delivery Address" value={order.deliveryAddress} />
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Price"
                value={`₹ ${order.price.toLocaleString()}`}
              />
              <InfoItem label="Payment Type" value={order.paymentType} />
            </div>
            {order.status === 'Delivered (OTP verified)' && (
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Delivery Date"
                  value={order.deliveryDate ?? 'N/A'}
                />
                <InfoItem
                  label="Delivery Time"
                  value={order.deliveryTime ?? 'N/A'}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href={`/order/${order.id}/label`} target="_blank" rel="noopener noreferrer">
                <FileText />
                Generate Shipping Label
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/scan`}>
                <QrCode />
                Verify Delivery (Scan)
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 />
                  Delete Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    order {order.id}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
        <AiInsights order={order} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
