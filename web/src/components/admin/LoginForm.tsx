"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/admin";

type Props = {
  redirect?: string;
};

export function LoginForm({ redirect }: Props) {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect ?? "/admin"} />

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
