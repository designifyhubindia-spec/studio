import { QrScanner } from '@/components/delivery/qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScanPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Delivery Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <QrScanner />
        </CardContent>
      </Card>
    </div>
  );
}
