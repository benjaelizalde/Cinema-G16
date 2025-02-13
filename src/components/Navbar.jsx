"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // Obtiene la ruta actual

  const isActive = (path) => pathname === path; // Verifica si la ruta coincide con la actual

  return (
    <ul className="flex bg-slate-900 border-b">
      <li className="mr-1">
        <Link
          className="bg-slate-1000 inline-block py-2 px-4 text-white-500 hover:text-slate-300 font-semibold"
          href="/"
        >
          Cinema
        </Link>
      </li>
      <li className="mr-1">
        <Link
          className={`inline-block py-2 px-4 font-semibold rounded-t ${
            isActive("/")
              ? "-mb-px bg-slate-900 border-l border-t border-r text-white-700"
              : "bg-slate-1000 text-white-500 hover:text-slate-300 border-b-slate-700"
          }`}
          href="/"
        >
          Menú Principal
        </Link>
      </li>
      <li className="mr-1">
        <Link
          className={`inline-block py-2 px-4 font-semibold rounded-t ${
            isActive("/cines")
              ? "-mb-px bg-slate-900 border-l border-t border-r text-white-700"
              : "bg-slate-1000 text-white-500 hover:text-slate-300 border-b-slate-700"
          }`}
          href="/cines"
        >
          Cines
        </Link>
      </li>
      {/* <li className="mr-1">
        <Link
          className={`inline-block py-2 px-4 font-semibold rounded-t ${
            isActive("/about")
              ? "-mb-px bg-slate-900 border-l border-t border-r text-white-700"
              : "bg-slate-1000 text-white-500 hover:text-slate-300 border-b-slate-700"
          }`}
          href="/about"
        >
          Salas de Cine
        </Link>
      </li> */}
    </ul>
  );
}
