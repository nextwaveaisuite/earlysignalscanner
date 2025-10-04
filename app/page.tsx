"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // ✅ Auto-redirect users to the Beginner Dashboard as soon as they hit "/"
  useEffect(() => {
    router.replace("/beginner");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-slate-700">
          Redirecting you to the <span className="text-blue-600">Beginner Dashboard</span>...
        </h1>
        <p className="mt-3 text-slate-500 text-sm">
          If you’re not redirected automatically,{" "}
          <a href="/beginner" className="text-blue-600 underline">
            click here
          </a>
          .
        </p>
      </div>
    </main>
  );
          }
