import { format, parseISO } from 'date-fns';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Formats an ISO date/datetime as `MMM d, yyyy`. */
export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

/** Formats an ISO datetime as `MMM d, yyyy HH:mm`. */
export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy HH:mm');
}

/** Formats a CNPJ document string (14 digits) as `00.000.000/0000-00`. */
export function formatDocument(document: string): string {
  if (document.length !== 14) return document;
  return document.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
