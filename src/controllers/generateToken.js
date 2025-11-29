import { generateTimedHash } from "../utils/hash.js";

export default async function generateToken(request, env) {
  const url = new URL(request.url);
  const ttl = parseInt(url.searchParams.get("ttl") || "0", 10);

  const { token, expiresAt } = await generateTimedHash(ttl, env);

  return new Response(JSON.stringify({ token, expiresAt }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
