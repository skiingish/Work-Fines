import * as bcrypt from 'bcrypt';

// Function to hash PIN
export async function hashPin(pin: string): Promise<string> {
    try {
        // Generate a salt
        const saltRounds = 10; // You can adjust the number of salt rounds as needed
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash the pin with the salt
        const hashedPin = await bcrypt.hash(pin, salt);
        return hashedPin;
    } catch (error) {
        console.error("Error hashing PIN:", error);
        throw error; // Forward error to caller
    }
}

// Function to verify PIN
export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
    try {
        // Compare the provided pin with the hashed pin
        const result = await bcrypt.compare(pin, hashedPin);
        return result;
    } catch (error) {
        console.error("Error verifying PIN:", error);
        throw error; // Forward error to caller
    }
}
