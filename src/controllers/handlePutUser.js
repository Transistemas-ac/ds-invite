import getSessionDiscordId from "../utils/getSessionDiscordId";

export default async function handlePutUser(request, env) {
  const discordId = await getSessionDiscordId(request, env);
  const baseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://ds.transistemas.org",
    "Access-Control-Allow-Credentials": "true",
  };

  if (!discordId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: baseHeaders,
    });
  }

  const memberResponse = await fetch(
    `https://discord.com/api/guilds/${env.GUILD_ID}/members/${discordId}`,
    {
      headers: {
        Authorization: `Bot ${env.BOT_TOKEN}`,
      },
    }
  );

  if (!memberResponse.ok) {
    const errorMsg = memberResponse.status === 404
      ? "Debes unirte primero al servidor de Discord. Haz click en 'Unirme al servidor de Transistemas' en el paso 2."
      : `Error al verificar membresía: ${memberResponse.status}`;
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: memberResponse.status === 404 ? 403 : 502,
      headers: baseHeaders,
    });
  }

  const body = JSON.stringify({ discordId, isMember: true });

  return new Response(body, {
    status: 200,
    headers: baseHeaders,
  });
}
