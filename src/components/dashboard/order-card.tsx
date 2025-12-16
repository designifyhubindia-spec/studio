import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Order } from '@/lib/types';
import { OrderStatusBadge } from './order-status-badge';

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/order/${order.id}`}>
      <Card className="hover:shadow-md hover:border-primary/50 transition-all h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{order.id}</CardTitle>
              <CardDescription>{order.customerName}</CardDescription>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div>
            <p className="text-sm font-medium">{order.productName}</p>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
