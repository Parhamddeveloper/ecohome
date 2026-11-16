export function parseProjectId(value) {
  if (typeof value !== "string") return null;
  if (/^[a-f0-9]{24}$/.test(value)) return value;
  const id = Number(value);
  return /^[1-9][0-9]*$/.test(value) && Number.isSafeInteger(id) ? id : null;
}
