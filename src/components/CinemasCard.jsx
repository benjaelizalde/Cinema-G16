"use client";
import { useRouter } from "next/navigation";

export default function CinemasCard() {
  const router = useRouter();
  return (
    <div
      className="bg-slate-900 p-6 rounded-lg shadow-lg hover:bg-slate-800 hover:cursor-pointer flex items-center justify-center transition duration-300"
      onClick={() => router.push(`/cines`)}
    >
      <h3 className="font-bold text-2xl mb-2 text-center text-white">Ver Cines</h3>
    </div>
  );
}