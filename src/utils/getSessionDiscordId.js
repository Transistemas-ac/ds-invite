import parseCookies from "./parseCookies";

export default async function getSessionDiscordId(request, env) {
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const session = cookies.session;
  if (!session) return null;
  const parts = session.split(".");
  if (parts.length !== 2) return null;
  const [discordId, signature] = parts;
  if (!discordId || !signature) return null;
  const valid = await verifyDiscordId(discordId, signature, env.SECRET);
  if (!valid) return null;
  return discordId;
}
