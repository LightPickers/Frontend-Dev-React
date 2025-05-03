export default function loadAuthData() {
  const data = localStorage.getItem("auth");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
