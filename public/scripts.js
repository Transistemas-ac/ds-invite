const connectButton = document.getElementById("connectButton");
const roleButton = document.getElementById("roleButton");
const statusMessage = document.getElementById("statusMessage");

function setStatus(text, type) {
  statusMessage.textContent = text || "";
  statusMessage.className = "status " + (type || "neutral");
}

async function connectDiscord() {
  connectButton.disabled = true;
  roleButton.disabled = true;
  setStatus("Conectando tu Discord con la API de Transistemas…", "neutral");

  try {
    const response = await fetch("/user", {
      method: "PUT",
      credentials: "include",
    });

    if (response.status === 401) {
      setStatus(
        "Redirigiendo a Discord para autorizar la conexión…",
        "neutral"
      );
      window.location.href = "/login/discord";
      return;
    }

    if (!response.ok) {
      setStatus(
        "❌ No se pudo conectar tu Discord. Intentá de nuevo.",
        "error"
      );
      connectButton.disabled = false;
      return;
    }

    setStatus(
      "💚 Discord conectado correctamente a la API de Transistemas.",
      "success"
    );
    connectButton.disabled = false;
    roleButton.disabled = false;
  } catch (error) {
    setStatus(
      "❌ Error de conexión con el servidor. Intentá de nuevo más tarde.",
      "error"
    );
    connectButton.disabled = false;
  }
}

async function requestStudentRole() {
  roleButton.disabled = true;
  setStatus("Solicitando acceso a los canales de Estudiantes…", "neutral");

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setStatus(
        errorData.error ||
          "❌ No se pudo otorgar el acceso. Intentá de nuevo o contactá al equipo.",
        "error"
      );
      roleButton.disabled = false;
      return;
    }

    setStatus(
      "💚 ¡Listo! Ya tenés acceso a los canales de Estudiantes.",
      "success"
    );
    roleButton.disabled = false;
  } catch (error) {
    setStatus(
      "❌ Error de conexión con el bot. Intentá de nuevo más tarde.",
      "error"
    );
    roleButton.disabled = false;
  }
}

// Detectar si acabamos de volver del OAuth de Discord
function checkOAuthReturn() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Si hay un código OAuth en la URL, significa que volvimos del redirect
  if (code) {
    // Limpiar la URL para que se vea más limpia
    window.history.replaceState({}, document.title, window.location.pathname);

    // Ejecutar automáticamente la conexión
    connectDiscord();
  }
}

connectButton.addEventListener("click", connectDiscord);
roleButton.addEventListener("click", requestStudentRole);

// Ejecutar al cargar la página
checkOAuthReturn();
