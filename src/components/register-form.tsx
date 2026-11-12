"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormError, inputClass } from "@/components/field";
import { buttonClass } from "@/components/ui";
import { registerAction, type AuthState } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    registerAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <FormError message={state.error} />

      <Field label="Nama Lengkap" htmlFor="name">
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Contoh: Budi Santoso"
          className={inputClass}
          required
        />
      </Field>

      <Field
        label="Nomor HP"
        htmlFor="phone"
        hint="Gunakan nomor yang aktif. Nomor ini menjadi identitas member."
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="081234567890"
          className={inputClass}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="PIN" htmlFor="pin" hint="4-6 digit">
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{4,6}"
            autoComplete="new-password"
            placeholder="••••"
            className={inputClass}
            required
          />
        </Field>
        <Field label="Ulangi PIN" htmlFor="confirmPin">
          <input
            id="confirmPin"
            name="confirmPin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{4,6}"
            autoComplete="new-password"
            placeholder="••••"
            className={inputClass}
            required
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "lg", "w-full")}
      >
        {pending ? "Mendaftarkan..." : "Buat Kartu Member"}
      </button>

      <p className="text-center text-sm text-muted">
        Sudah punya member?{" "}
        <Link href="/masuk" className="font-semibold text-accent hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
