import { notFound } from 'next/navigation';
import { orders } from '@/lib/data';
import { OtpForm } from '@/components/delivery/otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type VerifyPageProps = {
  params: { id: string };
};

export default function VerifyPage({ params }: VerifyPageProps) {
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
