/** Server only. */
import { createHash, timingSafeEqual } from "node:crypto";

/** Presenter password. Falls back to "dev" only outside production. */
const expected = process.env.HOST_KEY ?? (process.env.NODE_ENV === "production" ? "" : "dev");

const digest = (value: string) => createHash("sha256").update(value).digest();

export function isHost(key: string | null | undefined) {
  if (!expected || !key) return false;
  return timingSafeEqual(digest(key), digest(expected));
}
