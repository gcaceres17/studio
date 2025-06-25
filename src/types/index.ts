export interface Customer {
  id: string;
  name?: string; // Puede venir como name o nombre
  nombre?: string;
  phone?: string;
  email?: string;
  createdAt?: Date;
}

export interface Reservation {
  id: string;
  customerId?: string;
  customerName?: string;
  cliente_id?: string;
  cliente_nombre?: string;
  servicio?: string;
  service?: string;
  fecha?: string | Date;
  date?: string | Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}
