import * as crypto from 'crypto';

const HMAC_SECRET_KEY = process.env.HMAC_SECRET_KEY!;

// Function to calculate HMAC hash of a input string
export function calculateHMAC(pin: string): string {
    const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY);
    hmac.update(pin);
    return hmac.digest('hex');
}