'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Reservation } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox"
import { Table } from '@tanstack/react-table';

// Extiende TableMeta para incluir onStatusChange
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    onStatusChange?: (id: string, status: string) => void;
  }
}

export const columns: ColumnDef<Reservation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Customer',
    accessorFn: (row) => row.customerName || row.cliente_nombre || '',
    id: 'customer',
  },
  {
    header: 'Service',
    accessorFn: (row) => row.service || row.servicio || '',
    id: 'service',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      // Soporta tanto 'date' como 'fecha' y previene 'Invalid Date'
      const raw = row.getValue('date') || row.original.fecha;
      if (!raw) return '';
      // Si raw es un objeto, intenta extraer la propiedad correcta
      const dateValue =
        typeof raw === 'string' || typeof raw === 'number' || raw instanceof Date
          ? raw
          : typeof raw === 'object' && raw !== null && 'toISOString' in raw
            ? (raw as Date).toISOString()
            : '';
      const date = new Date(dateValue);
      return isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('es-PY', {
            timeZone: 'America/Asuncion',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status: Reservation['status'] = row.getValue('status');
      return (
        <Badge
          className={cn({
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': status === 'confirmed',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': status === 'pending',
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': status === 'cancelled',
          })}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const reservation = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(reservation.id)}
            >
              Copy reservation ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const res = await fetch(`http://127.0.0.1:8000/reservas/${reservation.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...reservation, status: 'confirmed' }),
                });
                if (res.ok) {
                  window.location.reload(); // Recarga la página para reflejar el cambio
                  // Actualiza el estado de la reserva en la tabla
                  table.setRowSelection((prev) => ({
                    ...prev,
                    [row.id]: true,
                  }));
                  // Llama a la función onStatusChange si está definida
                  if (typeof table.options.meta?.onStatusChange === 'function') {
                    table.options.meta.onStatusChange(reservation.id, 'confirmed');
                  }
                } else {
                  alert('Error al actualizar la reserva');
                }
              }}
            >
              Mark as confirmed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const res = await fetch(`http://127.0.0.1:8000/reservas/${reservation.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...reservation, status: 'cancelled' }),
                });
                if (res.ok) {
                  window.location.reload();
                  // Actualiza el estado de la reserva en la tabla
                  table.setRowSelection((prev) => ({
                    ...prev,
                    [row.id]: true,
                  }));
                  if (typeof table.options.meta?.onStatusChange === 'function') {
                    table.options.meta.onStatusChange(reservation.id, 'cancelled');
                  }
                } else {
                  alert('Error al actualizar la reserva');
                }
              }}
            >
              Mark as cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
