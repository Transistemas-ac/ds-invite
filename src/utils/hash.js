import base64UrlEncode from "./base64UrlEncode.js";

const encoder = new TextEncoder();

async function sign(payload, secret) {
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

  return base64UrlEncode(new Uint8Array(signature));
}

export async function generateTimedHash(ttlSeconds, env) {
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) ttlSeconds = 600;
  if (ttlSeconds > 86400) ttlSeconds = 86400;

  const expiresAt = Date.now() + ttlSeconds * 1000;
  const payload = String(expiresAt);

  const signature = await sign(payload, env.ROLE_TOKEN_SECRET);

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

  const expected = await sign(payload, env.ROLE_TOKEN_SECRET);
  if (signature !== expected) return false;

  const expiresAt = parseInt(payload, 10);
  if (!Number.isFinite(expiresAt)) return false;

  if (Date.now() > expiresAt) return false;

  return true;
}
