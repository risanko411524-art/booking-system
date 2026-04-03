import { createHmac } from "crypto";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "default-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  if (sign(payload) !== signature) return false;

  const parts = payload.split(":");
  if (parts.length !== 2) return false;

  const expiresAt = parseInt(parts[1], 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = SESSION_MAX_AGE;
