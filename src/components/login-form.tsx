"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormError, inputClass } from "@/components/field";
import { buttonClass } from "@/components/ui";
import { loginAction, type AuthState } from "@/lib/actions/auth";

export function LoginForm({ next = "/profil" }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormError message={state.error} />

      <Field label="Nomor HP" htmlFor="phone">
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

      <Field label="PIN" htmlFor="pin">
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          maxLength={6}
          autoComplete="current-password"
          placeholder="••••"
          className={inputClass}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "lg", "w-full")}
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>

      <p className="text-center text-sm text-muted">
        Belum punya member?{" "}
        <Link href="/daftar" className="font-semibold text-accent hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
