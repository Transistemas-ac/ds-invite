import getSessionDiscordId from "../utils/getSessionDiscordId.js";
import parseCookies from "../utils/parseCookies.js";
import { verifyTimedHash } from "../utils/hash.js";

export default async function handleRequestStudentRole(
  request,
  env,
  allowOrigin
) {
  const url = new URL(request.url);

  const baseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Credentials": "true"
  };

  const discordId = await getSessionDiscordId(request, env);
  if (!discordId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: baseHeaders
    });
  }

  const memberCheck = await fetch(
    `https://discord.com/api/guilds/${env.GUILD_ID}/members/${discordId}`,
    {
      headers: {
        Authorization: `Bot ${env.BOT_TOKEN}`
      }
    }
  );

  if (!memberCheck.ok) {
    return new Response(
      JSON.stringify({
        error:
          "No eres miembrx del servidor. Primero debés unirte al servidor de Discord haciendo click en 'Unirme al servidor de Transistemas'."
      }),
      {
        status: 403,
        headers: baseHeaders
      }
    );
  }

  let token = url.searchParams.get("token");
  if (!token) {
    const cookies = parseCookies(request.headers.get("Cookie") || "");
    token = cookies.inviteToken || null;
  }

  const valid = await verifyTimedHash(token, env);

  if (!valid) {
    return new Response(
      JSON.stringify({ error: "❌ Token no válido o expirado" }),
      {
        status: 403,
        headers: baseHeaders
      }
    );
  }

  const apiUrl = `https://discord.com/api/guilds/${env.GUILD_ID}/members/${discordId}/roles/${env.STUDENT_ROLE_ID}`;

  let discordError = null;
  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  if (!res.ok && res.status !== 204) {
    const errorBody = await res.text();
    discordError = `Discord API error ${res.status}: ${errorBody}`;
    console.error("Discord API error:", discordError);
  }

  if (discordError) {
    return new Response(
      JSON.stringify({
        error: "❌ Error al asignar rol de Estudiante. " + discordError
      }),
      {
        status: 502,
        headers: baseHeaders
      }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: baseHeaders
  });
}
