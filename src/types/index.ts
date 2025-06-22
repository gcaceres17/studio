export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}
