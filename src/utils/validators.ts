export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPostalCode = (postalCode: string): boolean =>
  /^[A-Z0-9\s\-]{3,10}$/i.test(postalCode);

export const isValidExpiry = (expiry: string): boolean => {
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) {
    return false;
  }
  return true;
};

export const isValidCvv = (cvv: string): boolean => /^\d{3,4}$/.test(cvv);

export const isValidCardNumber = (cardNumber: string): boolean =>
  cardNumber.replace(/\s/g, '').length === 16;
