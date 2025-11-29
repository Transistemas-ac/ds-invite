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

  const body = JSON.stringify({ discordId });

  return new Response(body, {
    status: 200,
    headers: baseHeaders,
  });
}
