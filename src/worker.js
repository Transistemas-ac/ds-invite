import redirectToDiscordOAuth from "./controllers/redirectToDiscordOAuth.js";
import handleDiscordCallback from "./controllers/handleDiscordCallback.js";
import handlePutUser from "./controllers/handlePutUser.js";
import handleRequestStudentRole from "./controllers/handleRequestStudentRole.js";
import generateToken from "./controllers/generateToken.js";
import indexHtml from "../public/index.html";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/login/discord" && request.method === "GET") {
      return redirectToDiscordOAuth(env);
    }

    if (url.pathname === "/auth/discord/callback" && request.method === "GET") {
      return handleDiscordCallback(url, env);
    }

    if (url.pathname === "/user" && request.method === "PUT") {
      return handlePutUser(request, env);
    }

    if (url.pathname === "/hash" && request.method === "GET") {
      return generateToken(request, env);
    }

    if (url.pathname === "/" && request.method === "POST") {
      return handleRequestStudentRole(request, env);
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
