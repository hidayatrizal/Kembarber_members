"use client";

import { useActionState } from "react";
import { Field, FormError, inputClass } from "@/components/field";
import { buttonClass } from "@/components/ui";
import { ownerLoginAction, type AuthState } from "@/lib/actions/auth";

export function OwnerLoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    ownerLoginAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <FormError message={state.error} />

      <Field label="Username Owner" htmlFor="username">
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          enterKeyHint="next"
          placeholder="owner"
          className={inputClass}
          required
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          enterKeyHint="done"
          placeholder="••••••••"
          className={inputClass}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "lg", "w-full")}
      >
        {pending ? "Memeriksa..." : "Masuk Dashboard"}
      </button>
    </form>
  );
}
