function getFixedAsterisk(length = 4) {
  return "*".repeat(length);
}

function getRandomAsterisk(min = 3, max = 6) {
  const len = Math.floor(Math.random() * (max - min + 1)) + min;
  return "*".repeat(len);
}

export function maskName(name, { random = false } = {}) {
  if (!name) return "";
  const stars = random ? getRandomAsterisk(3, 5) : getFixedAsterisk(4);
  return name[0] + stars;
}

export function maskEmail(email, { random = false } = {}) {
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.split("@");

  const visibleChar = local[0];
  const stars = random ? getRandomAsterisk(4, 6) : getFixedAsterisk(5);

  return visibleChar + stars + "@" + domain;
}
