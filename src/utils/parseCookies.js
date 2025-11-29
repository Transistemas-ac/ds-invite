export default function parseCookies(header) {
  const result = {};
  if (!header) return result;
  const parts = header.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (!name) continue;
    result[name] = rest.join("=");
  }
  return result;
}
