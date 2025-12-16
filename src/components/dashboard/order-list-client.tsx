'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { OrderCard } from './order-card';
import type { Order, OrderStatus } from '@/lib/types';
import { Button } from '../ui/button';
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type OrderListClientProps = {
  initialOrders: Order[];
};

const statusFilters: OrderStatus[] = [
  'Pending',
  'Shipped',
  'Out for Delivery',
  'Delivered (OTP verified)',
];

export function OrderListClient({ initialOrders }: OrderListClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter(
          (order) =>
            order.status.toLowerCase().replace(/\s+/g, '-') === activeTab
        );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={activeTab}>
        {filteredOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No orders found
            </h3>
            <p className="text-sm text-muted-foreground">
              There are no orders with this status.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
