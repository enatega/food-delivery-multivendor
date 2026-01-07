// utils/crypto.ts

/**
 * Converts a hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Decrypt AES-GCM string in format iv:ciphertext:tag
 * @param enc - encrypted string
 * @returns decrypted string
 */
export async function decrypt(
  enc: string | null | undefined
): Promise<string | null | undefined> {
  if (!enc) return enc;

  try {
    const keyBase64 = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    if (!keyBase64) throw new Error('Encryption key not found');

    const [ivHex, encryptedHex, tagHex] = enc.split(':');
    if (!ivHex || !encryptedHex || !tagHex) return enc;

    const iv = hexToBytes(ivHex);
    const ciphertext = hexToBytes(encryptedHex);
    const tag = hexToBytes(tagHex);

    // Combine ciphertext + tag
    const data = new Uint8Array(ciphertext.length + tag.length);
    data.set(ciphertext, 0);
    data.set(tag, ciphertext.length);

    // Convert key from base64 to Uint8Array
    const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

    // Import key for AES-GCM
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes.buffer as ArrayBuffer, // <-- cast to ArrayBuffer
      'AES-GCM',
      false,
      ['decrypt']
    );

    // Decrypt using Web Crypto API
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }, // <-- cast to ArrayBuffer
      cryptoKey,
      data.buffer as ArrayBuffer // <-- cast to ArrayBuffer
    );

    // Decode UTF-8
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.warn('Decrypt failed:', err);
    return enc;
  }
}
