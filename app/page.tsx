// app/page.tsx
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic"; // prevent static HTML freezing

export default function Home() {
  redirect("/beginner");
}
