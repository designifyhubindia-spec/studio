'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, MessageSquareText } from 'lucide-react';
import { useOrders } from '@/context/orders-context';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


// In a real application, this would be generated server-side and sent via SMS.
const MOCK_OTP = '123456';

export function OtpForm({ order }: { order: Order }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { updateOrder } = useOrders();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (verified && audioRef.current) {
      audioRef.current.play();
    }
  }, [verified]);

  const handleResendOtp = () => {
    setLoading(true);
    // Simulate API call to resend OTP
    setTimeout(() => {
      toast({
        title: 'OTP Sent!',
        description: `A new OTP has been sent to ...${order.mobileNumber.slice(-4)}.`,
      });
      setLoading(false);
    }, 1000);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to verify OTP
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
        setTimeout(() => router.push(`/order/${order.id}`), 2500);
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
        <audio ref={audioRef} src="https://firebasestudio.page.link/cha-ching.mp3" preload="auto" />
        <CheckCircle2 className="h-16 w-16" />
        <h3 className="text-xl font-bold">Delivery Verified!</h3>
        <p className="text-sm text-muted-foreground">Redirecting to order details...</p>
      </div>
    );
  }

  return (
    <>
    <Alert className="mb-4">
        <MessageSquareText className="h-4 w-4" />
        <AlertTitle>OTP Sent!</AlertTitle>
        <AlertDescription>
         For demo purposes, the OTP is <strong>{MOCK_OTP}</strong>. In a real app, this would be sent via SMS.
        </AlertDescription>
      </Alert>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="tel"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="text-center text-lg tracking-[0.5em] h-12"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || otp.length !== 6} size="lg">
        {loading && <Loader2 className="animate-spin" />}
        {loading ? 'Verifying...' : 'Verify & Confirm Delivery'}
      </Button>
      <Button variant="link" type="button" onClick={handleResendOtp} disabled={loading} className="text-muted-foreground">
        Resend OTP
      </Button>
    </form>
    </>
  );
}
