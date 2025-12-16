'use client';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import Image from 'next/image';

export function ShippingLabel({ order }: { order: Order }) {
  const handlePrint = () => {
    window.print();
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    order.id
  )}`;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg print:shadow-none print:rounded-none print:p-0">
        <div className="border-4 border-black p-6 relative">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h1 className="text-2xl font-bold mb-2">ScentTrack Delivery</h1>
              <div className="mb-4">
                <p className="font-bold text-lg">TO:</p>
                <p className="text-lg">{order.customerName}</p>
                <p>{order.deliveryAddress}</p>
                <p>Ph: {order.mobileNumber}</p>
              </div>
              <div className="border-t-2 border-dashed border-gray-400 pt-4">
                <p className="font-bold">ITEM:</p>
                <p>
                  {order.productName} (Qty: {order.quantity})
                </p>
                <p className="font-bold mt-2">
                  Total: ₹ {order.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-between">
              <div className="w-full">
                <Image
                  src={qrCodeUrl}
                  alt={`QR Code for Order ${order.id}`}
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <p className="text-center font-mono text-sm mt-1">{order.id}</p>
              </div>
              <div className="text-center mt-4">
                <p className="text-2xl font-bold tracking-widest border-2 border-black p-2">
                  {order.paymentType}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t-4 border-black mt-6 pt-4">
            <p className="text-sm">
              FROM: ScentTrack Perfumes, 123 Fragrance Lane, Perfume City, 110011
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Label
        </Button>
      </div>
    </div>
  );
}
