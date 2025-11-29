import { getSessionDiscordId } from "../utils/getSessionDiscordId.js";
import { verifyTimedHash } from "../utils/hash.js";

export default async function handleRequestStudentRole(request, env) {
  const url = new URL(request.url);

  const discordId = await getSessionDiscordId(request, env);
  if (!discordId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = url.searchParams.get("token");
  const valid = await verifyTimedHash(token, env);

  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiUrl = `https://discord.com/api/guilds/${env.GUILD_ID}/members/${discordId}/roles/${env.STUDENT_ROLE_ID}`;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${env.BOT_TOKEN}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    return new Response(JSON.stringify({ error: "Failed to assign role" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
