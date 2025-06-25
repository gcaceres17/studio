'use client';

import { ColumnDef } from '@tanstack/react-table';
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
import { Checkbox } from "@/components/ui/checkbox"

// Extiende TableMeta para incluir onDelete
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    onDelete?: (id: string) => void;
  }
}

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: 'nombre',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'telefono',
    header: 'Phone',
  },
  {
    accessorKey: 'fecha_registro',
    header: 'Date Added',
    cell: ({ row }) => {
      const value = row.getValue('fecha_registro');
      if (!value) return '';
      const date = new Date(value as string);
      return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const customer = row.original;
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
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-600 focus:text-red-600 focus:bg-red-50'
              onClick={async () => {
              if (!window.confirm(`¿Seguro que deseas eliminar a ${customer.nombre}?`)) return;
              const res = await fetch(`http://127.0.0.1:8000/clientes/${customer.id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                if (typeof table.options.meta?.onDelete === 'function') {
                table.options.meta.onDelete(customer.id);
                }
                // Refresca la página después de eliminar
                if (typeof window !== "undefined") {
                window.location.reload();
                }
              } else {
                alert('Error al eliminar el cliente');
              }
              }}
            >
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export interface Customer {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_registro?: string; // o Date, pero el backend envía string ISO
}
