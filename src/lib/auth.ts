import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type Member } from "../generated/prisma/client";
import { getDb } from "./db";

export const SESSION_COOKIE = "kb_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionRole = "member" | "owner";

export type SessionPayload = {
  sub: string;
  role: SessionRole;
  name: string;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET wajib diatur di produksi (minimal 32 karakter).",
      );
    }
    return new TextEncoder().encode(
      "kembabershop-development-secret-change-me-please",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(pin: string, hash: string) {
  return bcrypt.compare(pin, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || (payload.role !== "member" && payload.role !== "owner")) {
      return null;
    }
    return {
      sub: payload.sub,
      role: payload.role,
      name: typeof payload.name === "string" ? payload.name : "",
    };
  } catch {
    return null;
  }
}

export async function getCurrentMember(): Promise<Member | null> {
  const session = await getSession();
  if (!session || session.role !== "member") return null;

  return getDb().member.findUnique({ where: { id: session.sub } });
}

export async function requireGuest() {
  const session = await getSession();
  if (!session) return;

  if (session.role === "owner") redirect("/owner");

  const member = await getCurrentMember();
  if (member) redirect("/profil");

  // A signed JWT whose member row no longer exists is treated as signed out.
}

export async function requireMember(next = "/profil"): Promise<Member> {
  const session = await getSession();
  if (!session || session.role !== "member") {
    redirect(`/masuk?next=${encodeURIComponent(next)}`);
  }
  const member = await getCurrentMember();
  if (!member) {
    redirect("/api/auth/reset");
  }
  return member;
}

export async function requireOwner(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    redirect("/owner/masuk");
  }
  return session;
}

export function verifyOwnerCredentials(username: string, password: string) {
  const expectedUser = process.env.OWNER_USERNAME;
  const expectedPass = process.env.OWNER_PASSWORD;

  if (!expectedUser || !expectedPass) return false;

  return username === expectedUser && password === expectedPass;
}
