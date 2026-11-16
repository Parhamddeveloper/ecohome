import { TEAM_PHOTO_LIMIT } from "../data/team-photo.js";

export function parseTeamPhoto(bytes) {
  if (!bytes.length || bytes.length > TEAM_PHOTO_LIMIT) return null;

  if (bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return { bytes, contentType: "image/png" };
  }
  if (bytes.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"))) {
    return { bytes, contentType: "image/jpeg" };
  }
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return { bytes, contentType: "image/webp" };
  }
  return null;
}
