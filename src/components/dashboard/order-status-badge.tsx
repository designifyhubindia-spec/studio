import {
  CheckCircle2,
  Package,
  Truck,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import type { OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type OrderStatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

const statusConfig = {
  Pending: {
    icon: Clock,
    color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    label: 'Pending',
  },
  Shipped: {
    icon: Package,
    color: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
    label: 'Shipped',
  },
  'Out for Delivery': {
    icon: Truck,
    color: 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
    label: 'Out for Delivery',
  },
  'Delivered (OTP verified)': {
    icon: CheckCircle2,
    color: 'bg-green-500/20 text-green-700 border-green-500/30',
    label: 'Delivered',
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    icon: AlertTriangle,
    color: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
    label: 'Unknown',
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('flex items-center gap-1.5 whitespace-nowrap', config.color, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
