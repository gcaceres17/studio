import { Customer, Reservation } from '@/types';

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Alice Johnson', phone: '123-456-7890', email: 'alice@example.com', createdAt: new Date('2023-10-01') },
  { id: '2', name: 'Bob Williams', phone: '234-567-8901', email: 'bob@example.com', createdAt: new Date('2023-10-05') },
  { id: '3', name: 'Charlie Brown', phone: '345-678-9012', email: 'charlie@example.com', createdAt: new Date('2023-10-12') },
  { id: '4', name: 'Diana Miller', phone: '456-789-0123', email: 'diana@example.com', createdAt: new Date('2023-11-20') },
  { id: '5', name: 'Ethan Davis', phone: '567-890-1234', email: 'ethan@example.com', createdAt: new Date('2023-11-21') },
];

export const mockReservations: Reservation[] = [
  { id: 'res1', customerId: '1', customerName: 'Alice Johnson', service: 'Haircut', date: new Date(new Date().setDate(new Date().getDate() - 5)), status: 'confirmed' },
  { id: 'res2', customerId: '2', customerName: 'Bob Williams', service: 'Manicure', date: new Date(new Date().setDate(new Date().getDate() - 3)), status: 'confirmed' },
  { id: 'res3', customerId: '3', customerName: 'Charlie Brown', service: 'Pedicure', date: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'pending' },
  { id: 'res4', customerId: '1', customerName: 'Alice Johnson', service: 'Facial', date: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'confirmed' },
  { id: 'res5', customerId: '4', customerName: 'Diana Miller', service: 'Massage', date: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'pending' },
  { id: 'res6', customerId: '5', customerName: 'Ethan Davis', service: 'Haircut & Shave', date: new Date(new Date().setDate(new Date().getDate() + 7)), status: 'confirmed' },
  { id: 'res7', customerId: '2', customerName: 'Bob Williams', service: 'Consultation', date: new Date(new Date().setDate(new Date().getDate() - 10)), status: 'cancelled' },
];
