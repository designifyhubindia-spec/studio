import { notFound } from 'next/navigation';
import { orders } from '@/lib/data';
import { ShippingLabel } from '@/components/order/shipping-label';

type LabelPageProps = {
  params: { id: string };
};

export default function LabelPage({ params }: LabelPageProps) {
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }

  return <ShippingLabel order={order} />;
}
