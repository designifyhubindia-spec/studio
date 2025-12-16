'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Order } from '@/lib/types';
import { orders as initialOrdersData } from '@/lib/data';

type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updatedOrder: Partial<Order>) => void;
  getOrderById: (orderId: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrdersData);

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [order, ...prevOrders]);
  };

  const updateOrder = (orderId: string, updatedOrder: Partial<Order>) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, ...updatedOrder } : order
      )
    );
  };
    
  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
