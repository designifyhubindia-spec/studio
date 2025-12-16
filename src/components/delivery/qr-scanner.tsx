'use client';
import { Button } from '@/components/ui/button';
import { QrCode, ScanLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QrScanner() {
  const router = useRouter();

  const handleScan = () => {
    // In a real app, this would come from a QR scanner library
    const scannedOrderId = 'ST-240703'; 
    router.push(`/delivery/${scannedOrderId}/verify`);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64 bg-slate-900 rounded-lg overflow-hidden border-4 border-primary/50">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <ScanLine className="text-primary/70 h-48 w-48 animate-pulse" />
        </div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 animate-[scan_2s_ease-in-out_infinite]"></div>
      </div>
      <p className="text-center text-muted-foreground">
        Position the order QR code inside the frame to scan.
      </p>
      <Button onClick={handleScan} className="w-full">
        <QrCode className="mr-2" />
        Simulate Scan & Verify Order
      </Button>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
        }
      `}</style>
    </div>
  );
}
