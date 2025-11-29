export default function redirectToDiscordOAuth(env) {
  const authorizeUrl = new URL("https://discord.com/api/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", env.CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", env.REDIRECT_URI);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "identify");
  authorizeUrl.searchParams.set("prompt", "consent");

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
    },
  });
}
