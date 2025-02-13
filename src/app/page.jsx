import CinemasCard from "@/components/CinemasCard";

export default function HomePage() {
  return (
    <section className="container mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold text-white mb-10">Bienvenido a Cinema Management</h1>
      <p className="text-lg text-gray-300 mb-10">Administra tus cines y salas de manera eficiente</p>
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <CinemasCard />
      </div>
    </section>
  );
}