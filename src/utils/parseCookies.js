export default function parseCookies(header) {
  const result = {};
  if (!header) return result;
  const parts = header.split(";");
  for (const part of parts) {
    const cookiePair = part.trim();
    if (!cookiePair) continue;
    const eqIndex = cookiePair.indexOf("=");
    if (eqIndex === -1) continue;
    const name = cookiePair.substring(0, eqIndex);
    const value = cookiePair.substring(eqIndex + 1);
    result[name] = value;
  }
  return result;
}
