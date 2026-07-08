import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/tests/test-utils';
import { CustomersPage } from './CustomersPage';

describe('CustomersPage (integration)', () => {
  it('renders seed customers from the mocked API', async () => {
    renderWithProviders(<CustomersPage />);

    expect(await screen.findByText('ACME Distribution')).toBeInTheDocument();
    expect(screen.getByText('Globex Retail')).toBeInTheDocument();
    expect(screen.getByText('Initech Foods')).toBeInTheDocument();
  });

  it('creates a new customer through the form and shows it in the list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await screen.findByText('ACME Distribution');

    await user.click(screen.getByRole('button', { name: /new customer/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/name/i), 'Wayne Industries');
    await user.type(within(dialog).getByLabelText(/document/i), '11222333000144');
    await user.type(within(dialog).getByLabelText(/email/i), 'supply@wayne.example');
    await user.click(await within(dialog).findByLabelText(/Truck \(TRUCK\)/i));

    await user.click(within(dialog).getByRole('button', { name: /create customer/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(await screen.findByText('Wayne Industries')).toBeInTheDocument();
  });

  it('validates required fields before submitting', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomersPage />);

    await screen.findByText('ACME Distribution');
    await user.click(screen.getByRole('button', { name: /new customer/i }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /create customer/i }));

    expect(
      await within(dialog).findByText(/name must have at least 2 characters/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
