function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function decryptPassword(
  enc: string | null | undefined,
  keyString: string | undefined
): Promise<string | null | undefined> {
  if (!enc || !keyString) return enc;

  try {
    const parts = enc.split(':');
    if (parts.length !== 2) return enc;

    const [ivHex, encryptedHex] = parts;
    if (!ivHex || !encryptedHex) return enc;

    const iv = hexToBytes(ivHex);
    const ciphertext = hexToBytes(encryptedHex);

    let finalKeyBytes: Uint8Array;
    if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
      finalKeyBytes = hexToBytes(keyString);
    } else {
      const keyBytes = new TextEncoder().encode(keyString);
      finalKeyBytes = new Uint8Array(32);
      finalKeyBytes.set(keyBytes.slice(0, 32));
    }

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      finalKeyBytes.buffer as ArrayBuffer,
      'AES-CBC',
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer },
      cryptoKey,
      ciphertext.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.warn('Decrypt failed:', err);
    return enc;
  }
}
