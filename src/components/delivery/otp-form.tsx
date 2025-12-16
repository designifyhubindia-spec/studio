'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useOrders } from '@/context/orders-context';

const MOCK_OTP = '123456';

export function OtpForm({ order }: { order: Order }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { updateOrder } = useOrders();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        setVerified(true);
        const now = new Date();
        updateOrder(order.id, { 
          status: 'Delivered (OTP verified)',
          deliveryDate: now.toISOString().split('T')[0],
          deliveryTime: now.toTimeString().split(' ')[0].slice(0, 5),
        });
        toast({
          title: 'Delivery Confirmed!',
          description: `Order ${order.id} marked as delivered.`,
        });
        setTimeout(() => router.push(`/order/${order.id}`), 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid OTP',
          description: 'The OTP you entered is incorrect. Please try again.',
        });
        setOtp('');
      }
      setLoading(false);
    }, 1500);
  };

  if (verified) {
    return (
      <div className="flex flex-col items-center gap-4 text-center text-green-600">
        <CheckCircle2 className="h-16 w-16" />
        <h3 className="text-xl font-bold">Delivery Verified!</h3>
        <p className="text-sm text-muted-foreground">Redirecting to order details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="tel"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="text-center text-lg tracking-[0.5em]"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || otp.length !== 6}>
        {loading && <Loader2 className="animate-spin" />}
        {loading ? 'Verifying...' : 'Verify & Confirm Delivery'}
      </Button>
      <Button variant="link" type="button" disabled={loading} className="text-muted-foreground">
        Resend OTP
      </Button>
    </form>
  );
}
