export type OrderStatus =
  | 'Pending'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered (OTP verified)';

export type Order = {
  id: string;
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
  productName: string;
  quantity: number;
  price: number;
  paymentType: 'COD' | 'Prepaid';
  status: OrderStatus;
  deliveryDate?: string;
  deliveryTime?: string;
  locationData?: string;
};
