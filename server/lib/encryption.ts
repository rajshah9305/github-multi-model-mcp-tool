import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { ENV } from "./env";

const ALGORITHM = "aes-256-gcm";
const SALT = "github-mcp-salt"; // In production, this should be stored securely

/**
 * Derive a key from the JWT_SECRET using scrypt
 */
function getDerivedKey(): Buffer {
  return scryptSync(ENV.cookieSecret, SALT, 32);
}

/**
 * Encrypt a sensitive value (e.g., GitHub PAT, API key)
 */
export function encryptValue(plaintext: string): string {
  if (!plaintext) {
    return "";
  }

  const key = getDerivedKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt a sensitive value
 */
export function decryptValue(encrypted: string): string {
  if (!encrypted) {
    return "";
  }

  const key = getDerivedKey();
  const [ivHex, authTagHex, encryptedHex] = encrypted.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted value format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
