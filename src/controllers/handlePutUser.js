import getSessionDiscordId from "../utils/getSessionDiscordId";

export default async function handlePutUser(request, env) {
  const discordId = await getSessionDiscordId(request, env);
  if (!discordId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = JSON.stringify({ discordId });

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
