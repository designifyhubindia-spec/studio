'use server';

/**
 * @fileOverview This file defines a Genkit flow for the DeliveryInsightsTool feature.
 *
 * - deliveryInsights - An asynchronous function that takes delivery data and location (when available) to infer whether any information should be flagged for closer human review.
 * - DeliveryInsightsInput - The input type for the deliveryInsights function.
 * - DeliveryInsightsOutput - The return type for the deliveryInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeliveryInsightsInputSchema = z.object({
  orderId: z.string().describe('The unique identifier for the order.'),
  customerName: z.string().describe('The name of the customer.'),
  mobileNumber: z.string().describe('The customer mobile number.'),
  deliveryAddress: z.string().describe('The complete delivery address.'),
  productName: z.string().describe('The name of the product (perfume).'),
  quantity: z.number().describe('The quantity of the product.'),
  price: z.number().describe('The price of the product.'),
  paymentType: z.enum(['COD', 'Prepaid']).describe('The payment type (COD or Prepaid).'),
  orderStatus: z.enum(['Pending', 'Shipped', 'Out for Delivery', 'Delivered (OTP verified)']).describe('The current status of the order.'),
  deliveryDate: z.string().optional().describe('The date the order was delivered, if applicable.'),
  deliveryTime: z.string().optional().describe('The time the order was delivered, if applicable.'),
  locationData: z.string().optional().describe('Optional GPS coordinates of delivery location.'),
});

export type DeliveryInsightsInput = z.infer<typeof DeliveryInsightsInputSchema>;

const DeliveryInsightsOutputSchema = z.object({
  flagForReview: z.boolean().describe('Whether the delivery should be flagged for closer human review.'),
  reason: z.string().describe('The reason why the delivery is flagged for review. This should be concise and actionable.'),
});

export type DeliveryInsightsOutput = z.infer<typeof DeliveryInsightsOutputSchema>;

export async function deliveryInsights(input: DeliveryInsightsInput): Promise<DeliveryInsightsOutput> {
  return deliveryInsightsFlow(input);
}

const deliveryInsightsPrompt = ai.definePrompt({
  name: 'deliveryInsightsPrompt',
  input: {schema: DeliveryInsightsInputSchema},
  output: {schema: DeliveryInsightsOutputSchema},
  prompt: `You are an expert AI assistant for a perfume delivery service, specializing in logistics and fraud detection. Your task is to analyze delivery data and flag potential issues that require human review.

  Analyze the following delivery information and determine if it should be flagged.

  Key factors to consider:
  - **Payment Mismatch:** High-value Cash on Delivery (COD) orders are higher risk. Flag if a high-priced item is COD.
  - **Status Anomalies:** Flag if an order is 'Pending' for an unusually long time without being shipped.
  - **Location Discrepancy:** If GPS location data is available, compare it with the delivery address. Flag for significant mismatches.
  - **Unusual Patterns:** Look for anything out of the ordinary, like bulk orders of a single perfume to a residential address, which might indicate resale.
  - **COD on 'Delivered' Status:** If an order is COD and marked as 'Delivered (OTP verified)', it's generally a good sign, but cross-reference with other factors. A COD order delivered without location data might be worth a second look.
  - **Prepaid Orders:** These are generally lower risk but are not immune to issues.

  Delivery Data:
  - Order ID: {{{orderId}}}
  - Customer: {{{customerName}}}
  - Mobile: {{{mobileNumber}}}
  - Address: {{{deliveryAddress}}}
  - Product: {{{productName}}} (x{{{quantity}}})
  - Price: ₹{{{price}}}
  - Payment: {{{paymentType}}}
  - Status: {{{orderStatus}}}
  - Delivery Timestamp: {{{deliveryDate}}} {{{deliveryTime}}}
  - GPS Location: {{{locationData}}}

  Based on your analysis, set \`flagForReview\` to \`true\` if a human should investigate, or \`false\` otherwise.
  In the \`reason\` field, provide a clear, concise, and actionable explanation for your decision.
  `,
});

const deliveryInsightsFlow = ai.defineFlow(
  {
    name: 'deliveryInsightsFlow',
    inputSchema: DeliveryInsightsInputSchema,
    outputSchema: DeliveryInsightsOutputSchema,
  },
  async input => {
    const {output} = await deliveryInsightsPrompt(input);
    return output!;
  }
);
