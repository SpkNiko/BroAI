"use client";

import { useTransition } from "react";

import { logoutAction } from "@/app/app-actions";

export function LogoutButton() {
  const [
    pending,
    startTransition,
  ] = useTransition();

  return (
    <button
      className="btn btn-ghost"
      disabled={pending}
      onClick={() =>
        startTransition(() =>
          logoutAction()
        )
      }
    >
      {pending
        ? "Wylogowywanie…"
        : "Wyloguj"}
    </button>
  );
}
