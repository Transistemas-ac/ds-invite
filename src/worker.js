import redirectToDiscordOAuth from "./controllers/redirectToDiscordOAuth.js";
import handleDiscordCallback from "./controllers/handleDiscordCallback.js";
import handlePutUser from "./controllers/handlePutUser.js";
import handleRequestStudentRole from "./controllers/handleRequestStudentRole.js";
import generateToken from "./controllers/generateToken.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Determinar el origen permitido dinámicamente
    const allowedOrigins = [
      "https://ds.transistemas.org",
      "https://ds-invite.dns-monitor.workers.dev",
    ];

    const requestOrigin = request.headers.get("Origin");
    const allowOrigin = allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : "https://ds.transistemas.org";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Rutas de autenticación
    if (url.pathname === "/login/discord" && request.method === "GET") {
      return redirectToDiscordOAuth(env);
    }

    if (url.pathname === "/auth/discord/callback" && request.method === "GET") {
      return handleDiscordCallback(url, env);
    }

    if (url.pathname === "/user" && request.method === "PUT") {
      return handlePutUser(request, env, allowOrigin);
    }

    if (url.pathname === "/hash" && request.method === "GET") {
      return generateToken(request, env);
    }

    // Asignación de rol de estudiante
    if (url.pathname === "/" && request.method === "POST") {
      return handleRequestStudentRole(request, env, allowOrigin);
    }

    // Servir index.html usando Assets
    if (url.pathname === "/" && request.method === "GET") {
      try {
        // Construir una nueva Request con el pathname correcto
        const assetUrl = new URL("/index.html", request.url);
        const asset = await env.ASSETS.fetch(assetUrl);
        return asset;
      } catch (error) {
        return new Response("Error loading page", { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
