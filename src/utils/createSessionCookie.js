import signDiscordId from "./signDiscordId";

export default async function createSessionCookie(discordId, env) {
  const signature = await signDiscordId(discordId, env.SECRET);
  const value = `${discordId}.${signature}`;
  const cookie = `session=${value}; Path=/; HttpOnly; Secure; SameSite=None`;
  return cookie;
}
