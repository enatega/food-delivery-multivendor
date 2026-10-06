"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.push("/not-found");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-gray-600">Taking you to a safe page…</p>
    </main>
  );
}
