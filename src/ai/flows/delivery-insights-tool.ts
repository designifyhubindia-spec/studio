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
  reason: z.string().describe('The reason why the delivery is flagged for review.'),
});

export type DeliveryInsightsOutput = z.infer<typeof DeliveryInsightsOutputSchema>;

export async function deliveryInsights(input: DeliveryInsightsInput): Promise<DeliveryInsightsOutput> {
  return deliveryInsightsFlow(input);
}

const deliveryInsightsPrompt = ai.definePrompt({
  name: 'deliveryInsightsPrompt',
  input: {schema: DeliveryInsightsInputSchema},
  output: {schema: DeliveryInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes delivery data to identify potential issues.

  Based on the following delivery information, determine if the delivery should be flagged for closer human review.

  Consider factors such as order status, payment type, and available location data.
  If the order status is still pending after a long time, or there are discrepancies between payment type and order status, or location data greatly differs from delivery address, or other anomalies are detected, flag the delivery for review.

  Order ID: {{{orderId}}}
  Customer Name: {{{customerName}}}
  Mobile Number: {{{mobileNumber}}}
  Delivery Address: {{{deliveryAddress}}}
  Product Name: {{{productName}}}
  Quantity: {{{quantity}}}
  Price: {{{price}}}
  Payment Type: {{{paymentType}}}
  Order Status: {{{orderStatus}}}
  Delivery Date: {{{deliveryDate}}}
  Delivery Time: {{{deliveryTime}}}
  Location Data: {{{locationData}}}

  Set flagForReview to true if the delivery should be reviewed, otherwise set it to false.
  Provide a brief reason for your decision in the reason field.
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
