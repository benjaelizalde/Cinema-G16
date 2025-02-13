import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-[calc(100vh-7rem)] justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p>Página no encontrada</p>
        <Link href="/" className="text-slate-200 hover:text-slate-400">Volver a la página principal</Link>
      </div>
    </section>
  );
}
