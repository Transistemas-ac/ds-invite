import getSessionDiscordId from "../utils/getSessionDiscordId.js";
import parseCookies from "../utils/parseCookies.js";
import { verifyTimedHash } from "../utils/hash.js";

export default async function handleRequestStudentRole(request, env) {
  const url = new URL(request.url);

  const baseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://ds.transistemas.org",
    "Access-Control-Allow-Credentials": "true",
  };

  const discordId = await getSessionDiscordId(request, env);
  if (!discordId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: baseHeaders,
    });
  }

  let token = url.searchParams.get("token");
  if (!token) {
    const cookies = parseCookies(request.headers.get("Cookie") || "");
    token = cookies.inviteToken || null;
  }

  const valid = await verifyTimedHash(token, env);

  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 403,
      headers: baseHeaders,
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
      headers: baseHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: baseHeaders,
  });
}
