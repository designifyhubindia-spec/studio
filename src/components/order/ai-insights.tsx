'use client';

import { useState } from 'react';
import { deliveryInsights } from '@/ai/flows/delivery-insights-tool';
import type { DeliveryInsightsInput, DeliveryInsightsOutput } from '@/ai/flows/delivery-insights-tool';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bot, CheckCircle2, Loader2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function AiInsights({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeliveryInsightsOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const input: DeliveryInsightsInput = {
        ...order,
        orderStatus: order.status,
      };
      const response = await deliveryInsights(input);
      setResult(response);
    } catch (error) {
      console.error('Error analyzing delivery:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get insights from the AI model.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          <span>AI Delivery Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Use AI to check for potential issues with this delivery.
        </p>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? 'Analyzing...' : 'Analyze Delivery'}
        </Button>
        {result && (
          <Alert variant={result.flagForReview ? 'destructive' : 'default'}>
            {result.flagForReview ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.flagForReview
                ? 'Review Recommended'
                : 'Looks Good'}
            </AlertTitle>
            <AlertDescription>{result.reason}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
