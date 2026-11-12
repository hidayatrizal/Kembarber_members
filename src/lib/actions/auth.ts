"use server";

import { redirect } from "next/navigation";
import {
  clearSession,
  createSession,
  hashPin,
  verifyOwnerCredentials,
  verifyPin,
} from "@/lib/auth";
import { getDb } from "@/lib/db";
import { normalizePhone } from "@/lib/utils";

export type AuthState = { error?: string };

function safeNext(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value : "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/profil";
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const pin = String(formData.get("pin") ?? "").trim();
  const confirmPin = String(formData.get("confirmPin") ?? "").trim();

  if (name.length < 2) {
    return { error: "Nama minimal 2 karakter." };
  }
  if (phone.length < 9 || phone.length > 15 || !/^0\d+$/.test(phone)) {
    return { error: "Nomor HP tidak valid. Contoh: 081234567890." };
  }
  if (!/^\d{4,6}$/.test(pin)) {
    return { error: "PIN harus 4-6 digit angka." };
  }
  if (pin !== confirmPin) {
    return { error: "Konfirmasi PIN tidak sama." };
  }

  const db = getDb();

  const existing = await db.member.findUnique({
    where: { phone },
    select: { id: true },
  });

  if (existing) {
    return { error: "Nomor HP sudah terdaftar. Silakan masuk." };
  }

  const pinHash = await hashPin(pin);

  try {
    const created = await db.member.create({
      data: { name, phone, pinHash },
      select: { id: true, name: true },
    });

    await createSession({ sub: created.id, role: "member", name: created.name });
  } catch {
    return { error: "Gagal mendaftar. Coba lagi sebentar." };
  }

  redirect("/profil?selamat=1");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const pin = String(formData.get("pin") ?? "").trim();
  const next = safeNext(formData.get("next"));

  if (!phone || !pin) {
    return { error: "Nomor HP dan PIN wajib diisi." };
  }

  const db = getDb();
  const member = await db.member.findUnique({ where: { phone } });

  if (!member) {
    return { error: "Nomor HP belum terdaftar." };
  }

  const valid = await verifyPin(pin, member.pinHash);
  if (!valid) {
    return { error: "PIN salah. Silakan coba lagi." };
  }

  await createSession({ sub: member.id, role: "member", name: member.name });
  redirect(next);
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function ownerLoginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  if (!verifyOwnerCredentials(username, password)) {
    return { error: "Kredensial owner tidak valid." };
  }

  await createSession({ sub: "owner", role: "owner", name: "Owner" });
  redirect("/owner");
}

export async function ownerLogoutAction() {
  await clearSession();
  redirect("/owner/masuk");
}
