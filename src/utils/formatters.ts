export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export const maskCardNumber = (last4: string): string => `**** **** **** ${last4}`;

export const truncateEmail = (email: string): string => {
  if (email.length <= 22) {
    return email;
  }
  return `${email.slice(0, 19)}...`;
};
