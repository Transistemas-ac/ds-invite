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
      const errorData = await response.json();
      setStatus(
        errorData.error || "❌ No se pudo conectar tu Discord.",
        "error"
      );
      connectButton.disabled = false;
      roleButton.disabled = true;
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
    roleButton.disabled = true;
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

async function autoCheckDiscordConnection() {
  try {
    const response = await fetch("/user", {
      method: "PUT",
      credentials: "include",
    });

    if (!response.ok) {
      connectButton.disabled = false;
      roleButton.disabled = true;
      if (response.status !== 401) {
        const errorData = await response.json();
        setStatus(errorData.error || "❌ No pudiste conectar tu Discord.", "error");
      }
      return;
    }

    setStatus(
      "💚 Discord conectado correctamente a la API de Transistemas.",
      "success"
    );
    connectButton.disabled = false;
    roleButton.disabled = false;
  } catch (error) {
    connectButton.disabled = false;
  }
}

connectButton.addEventListener("click", connectDiscord);
roleButton.addEventListener("click", requestStudentRole);

document.addEventListener("DOMContentLoaded", () => {
  connectButton.disabled = false;
  roleButton.disabled = true;
  autoCheckDiscordConnection();
});
