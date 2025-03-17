/**
 * Generates a random alphanumeric ID of specified length using Node.js crypto when available
 * @param length The length of the ID to generate (default: 12)
 * @returns A random alphanumeric string
 */
export function createId(length: number = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  try {
    // Try to use Node.js crypto module
    const crypto = require('crypto');
    const randomValues = crypto.randomBytes(length);
    
    // Get random characters from the character set
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % characters.length;
      result += characters.charAt(randomIndex);
    }
  } catch (e) {
    // Fall back to Math.random() if crypto is not available
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  }
  
  return result;
}

/**
 * Node.js compatible version that doesn't rely on window.crypto
 * Falls back to Math.random() if crypto is not available
 */
export function createIdNode(length: number = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

/**
 * Universal version that works in Node.js environments
 */
export function createIdUniversal(length: number = 12): string {
  return createId(length);
}

// Default export for convenience
export default createIdUniversal;