import { customAlphabet } from 'nanoid';

// Define allowed prefixes to prevent invalid ones
export enum IdPrefix {
  USER = 'usr',           // user
  ORGANIZATION = 'org',   // organization
  SUBSCRIPTION = 'sub',   // subscription
  MODULE = 'mod',         // module
  MODULE_TYPE = 'mot',    // module type
  MODULE_FEATURE = 'mof', // module feature
  SESSION = 'ses',        // session
  TOKEN = 'tok',          // token
  VERIFICATION = 'ver',   // verification
  BLACKLIST = 'blk',      // blacklist
  DOCUMENTATION = 'doc',  // documentation
  LOG = 'log',            // log
  AUDIT = 'aud',          // audit
  PLAN = 'pla'            // plan
}

// Custom alphabet for better readability and safety
// Removed similar looking characters (0, O, 1, I, l)
const customNanoid = customAlphabet(
  '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
  21
);

/**
 * Generate a unique ID with optional prefix
 * @param prefix - Optional prefix to identify the type of ID
 * @param length - Length of the random part (default: 21)
 * @returns A unique ID string
 * @throws Error if prefix is invalid
 */
export function generateId(prefix?: IdPrefix, length = 21): string {
  // Validate prefix if provided
  if (prefix && !isValidPrefix(prefix)) {
    throw new Error(`Invalid prefix: ${prefix}. Must be one of: ${Object.values(IdPrefix).join(', ')}`);
  }

  // Generate the random part
  const randomPart = customNanoid(length);

  // Return with or without prefix
  return prefix ? `${prefix}_${randomPart}` : randomPart;
}

/**
 * Validate if a prefix is allowed
 * @param prefix - The prefix to validate
 * @returns boolean indicating if the prefix is valid
 */
function isValidPrefix(prefix: string): prefix is IdPrefix {
  return Object.values(IdPrefix).includes(prefix as IdPrefix);
}

/**
 * Extract the prefix from an ID
 * @param id - The ID to extract prefix from
 * @returns The prefix or undefined if no prefix
 */
export function extractPrefix(id: string): IdPrefix | undefined {
  const parts = id.split('_');
  if (parts.length !== 2) return undefined;
  
  const prefix = parts[0];
  return isValidPrefix(prefix) ? prefix : undefined;
}

/**
 * Generate a unique ID for a specific entity type
 * @param entityType - The type of entity to generate ID for
 * @returns A unique ID with appropriate prefix
 */
export function generateEntityId(entityType: IdPrefix): string {
  return generateId(entityType);
}

/**
 * Check if an ID has a valid format
 * @param id - The ID to validate
 * @returns boolean indicating if the ID is valid
 */
export function isValidId(id: string): boolean {
  // Check if it has a prefix
  const hasPrefix = id.includes('_');
  if (!hasPrefix) return true; // IDs without prefix are valid

  // Extract and validate prefix
  const prefix = extractPrefix(id);
  if (!prefix) return false;

  // Check if the random part has the correct length
  const randomPart = id.split('_')[1];
  return randomPart.length === 21;
}

/**
 * Check if an ID has a valid format for a specific prefix
 * @param id - The ID to validate
 * @param prefix - The prefix to validate against
 * @returns boolean indicating if the ID is valid
 */
export function isValidIdWithPrefix(id: string, prefix: IdPrefix): boolean {
  const regex = new RegExp(`^${prefix}_[a-zA-Z0-9]{21}$`);
  return regex.test(id);
}
