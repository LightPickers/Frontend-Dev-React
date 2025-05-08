export default function loadAuthData() {
  try {
    const storedData = localStorage.getItem("auth");
    return storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error("auth localStorage parse error", err);
    return null;
  }
}
