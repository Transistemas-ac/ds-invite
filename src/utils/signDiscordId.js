import base64UrlEncode from "./base64UrlEncode";

export default async function signDiscordId(discordId, secret) {
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
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return base64UrlEncode(signature);
}
