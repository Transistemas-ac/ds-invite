import base64UrlEncode from "./base64UrlEncode.js";

const encoder = new TextEncoder();

async function sign(payload, secret, length = 10) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  // Truncar a los primeros bytes y convertir a base64url
  const truncated = new Uint8Array(signature).slice(0, 8); // 8 bytes ≈ 11 chars
  return base64UrlEncode(truncated).slice(0, length);
}

export async function generateTimedHash(ttlSeconds, env) {
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) ttlSeconds = 600;
  if (ttlSeconds > 86400) ttlSeconds = 86400;

  const expiresAt = Date.now() + ttlSeconds * 1000;
  const payload = String(expiresAt);

  const signature = await sign(payload, env.SECRET, 10);

  return {
    token: `${payload}.${signature}`,
    expiresAt,
  };
}

export async function verifyTimedHash(token, env) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;

  const expected = await sign(payload, env.SECRET, 10);
  if (signature !== expected) return false;

  const expiresAt = parseInt(payload, 10);
  if (!Number.isFinite(expiresAt)) return false;

  if (Date.now() > expiresAt) return false;

  return true;
}
