'use client';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/context/orders-context';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function QrScanner() {
  const router = useRouter();
  const { orders } = useOrders();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        console.error('Camera API not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }

  }, [toast]);

  const handleScan = () => {
    // In a real app, this would use a library like html5-qrcode to decode the video stream.
    // For this demo, we'll pick a random "Out for Delivery" order to simulate a successful scan.
    const outForDeliveryOrders = orders.filter(o => o.status === 'Out for Delivery');
    
    if (outForDeliveryOrders.length > 0) {
      const randomOrder = outForDeliveryOrders[Math.floor(Math.random() * outForDeliveryOrders.length)];
      toast({
        title: 'QR Code Scanned!',
        description: `Order ${randomOrder.id} found. Redirecting to verification...`,
      });
      router.push(`/delivery/${randomOrder.id}/verify`);
    } else {
       toast({
        variant: "destructive",
        title: "No Orders to Verify",
        description: "There are no orders currently 'Out for Delivery' to scan and verify.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-4 border-primary/50 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 border-2 border-dashed border-white/50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>

       {!hasCameraPermission && (
          <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please grant camera access in your browser to scan QR codes.
            </AlertDescription>
          </Alert>
        )}

      <p className="text-center text-muted-foreground -mt-2">
        Position the QR code inside the frame to scan.
      </p>
      
      <Button onClick={handleScan} className="w-full" disabled={!hasCameraPermission}>
        <QrCode className="mr-2" />
        Simulate Scan & Verify Order
      </Button>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-80px); opacity: 0.5; }
          50% { transform: translateY(80px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
