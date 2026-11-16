const bytesPerMegabyte = 1024 * 1024;
export const TEAM_PHOTO_LIMIT = 4 * bytesPerMegabyte;
export const TEAM_PHOTO_LIMIT_LABEL = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 1,
}).format(TEAM_PHOTO_LIMIT / bytesPerMegabyte);
