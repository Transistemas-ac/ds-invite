export default function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binary);
  base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return base64;
}
