import createSessionCookie from "../utils/createSessionCookie.js";

export default async function handleDiscordCallback(url, env) {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_url: env.REDIRECT_URL,
    }),
  });

  if (!tokenResponse.ok) {
    return new Response("Failed to exchange code", { status: 500 });
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const tokenType = tokenData.token_type;

  if (!accessToken || !tokenType) {
    return new Response("Invalid token response", { status: 500 });
  }

  const meResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  if (!meResponse.ok) {
    return new Response("Failed to fetch user", { status: 500 });
  }

  const meData = await meResponse.json();
  const discordId = meData.id;

  if (!discordId) {
    return new Response("Could not determine Discord ID", { status: 500 });
  }

  const cookie = await createSessionCookie(discordId, env);

  const redirectTarget = env.POST_LOGIN_REDIRECT_URL || "/";

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      Location: redirectTarget,
    },
  });
}
