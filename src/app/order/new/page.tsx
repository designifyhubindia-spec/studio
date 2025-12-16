import { OrderForm } from '@/components/order/order-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Order</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
