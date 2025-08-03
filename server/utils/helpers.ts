// Generate unique referral ID
export function generateReferralId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `LK-${timestamp}-${randomStr}`.toUpperCase();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize user input
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
