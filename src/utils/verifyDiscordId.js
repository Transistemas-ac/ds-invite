import base64UrlDecode from "./base64UrlDecode.js";

export default async function verifyDiscordId(discordId, signature, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const data = encoder.encode(discordId);
  const sigBytes = base64UrlDecode(signature);
  return crypto.subtle.verify("HMAC", key, sigBytes, data);
}
