"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import EntradaPrecio from "@/components/EntradaPrecio";

export default function EditCine() {
  const router = useRouter();
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener datos del cine
    const fetchCine = async () => {
      try {
        const res = await fetch(`/api/cines/${id}`);
        const data = await res.json();
        if (data && data.direccion[0] && data.direccion[0].localidad) {
          setNombre(data.nombre);
          setCalle(data.direccion[0].calle);
          setNumero(data.direccion[0].numero);
          setSelectedLocalidad(data.direccion[0].localidad.nombre);
        } else {
          setError("No se encontraron datos del cine.");
        }
      } catch (error) {
        console.error("Error al obtener el cine:", error);
        setError("Error al obtener el cine.");
      }
    };

    // Obtener localidades desde el servidor
    const fetchLocalidades = async () => {
      try {
        const res = await fetch("/api/localidades");
        const data = await res.json();
        setLocalidades(data);
      } catch (error) {
        console.error("Error al obtener las localidades:", error);
      }
    };

    // Obtener turnos y precios de entrada desde el servidor
    const fetchTurnos = async () => {
      try {
        const res = await fetch("/api/turnos");
        const data = await res.json();
        const preciosRes = await fetch(`/api/cines/${id}/entradaPrecio`);
        const preciosData = await preciosRes.json();

        const turnosConPrecio = data.map((turno) => {
          const precioEntrada = preciosData.find(
            (precio) => precio.turnoId === turno.id
          );
          return {
            ...turno,
            precio: precioEntrada ? precioEntrada.precio : 0,
          };
        });

        setTurnos(turnosConPrecio);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener los turnos y precios de entrada:",
          error
        );
      }
    };
    fetchCine();
    fetchLocalidades();
    fetchTurnos();
  }, [id]);

  useEffect(() => {
    // Filtrar localidades que comienzan con la letra ingresada
    setFilteredLocalidades(
      localidades.filter((localidad) =>
        localidad.nombre
          .toLowerCase()
          .startsWith(selectedLocalidad.toLowerCase())
      )
    );
  }, [selectedLocalidad, localidades]);

  const handleUpdateCine = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || !selectedLocalidad || !calle || !numero) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const localidadValida = localidades.find(
      (localidad) => localidad.nombre == selectedLocalidad
    );

    if (!localidadValida) {
      setError("Seleccione una localidad válida.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Actualizar cine
      await fetch(`/api/cines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });

      // Actualizar dirección
      const selectedLocalidadObj = localidades.find(
        (localidad) => localidad.nombre === selectedLocalidad
      );

      if (!selectedLocalidadObj) {
        throw new Error("Localidad no encontrada");
      }

      await fetch(`/api/cines/${id}/direccion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calle,
          numero,
          localidadId: selectedLocalidadObj.id,
        }),
      });

      // Actualizar precios de entrada
      for (const turno of turnos) {
        await fetch(`/api/cines/${id}/entradaPrecio`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            turnoId: turno.id.toString(),
            precio: turno.precio,
          }),
        });
      }

      // Redirigir a la página de cines
      router.push("/cines");
    } catch (error) {
      console.error("Error al actualizar el cine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando datos del cine...</span>
        </Spinner>
        <h2 className="ml-3">Cargando datos del cine...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center pt-16">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner animation="border" role="status">
            <span className="sr-only">Actualizando cine...</span>
          </Spinner>
          <h2 className="ml-3">Actualizando cine...</h2>
        </div>
      ) : (
        <form
          className="bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-2xl"
          onSubmit={handleUpdateCine}
        >
          <h1 className="text-center font-extrabold text-2xl py-2">
            Modificar Cine
          </h1>
          <hr />
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-white-700 text-sm font-bold mb-2 py-2"
            >
              Nombre
            </label>
            <input
              id="nombre"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Ingrese el nombre del cine"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="localidad"
              className="block text-white-700 text-sm font-bold mb-2"
            >
              Localidad
            </label>
            <input
              id="localidad"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Ingrese el nombre de la localidad"
              list="localidades"
              onChange={(e) => setSelectedLocalidad(e.target.value)}
              value={selectedLocalidad}
            />
            <datalist id="localidades">
              {filteredLocalidades.map((localidad) => (
                <option key={localidad.id} value={localidad.nombre} />
              ))}
            </datalist>
          </div>
          <div className="mb-4">
            <label
              htmlFor="calle"
              className="block text-white-700 text-sm font-bold mb-2"
            >
              Calle
            </label>
            <input
              id="calle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Ingrese calle"
              onChange={(e) => setCalle(e.target.value)}
              value={calle}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numero"
              className="block text-white-700 text-sm font-bold mb-2"
            >
              Número
            </label>
            <input
              id="numero"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Ingrese el numero"
              onChange={(e) => setNumero(e.target.value)}
              value={numero}
            />
          </div>
          <div>
            <label
              htmlFor="entradaPrecio"
              className="block text-white-700 text-lg font-extrabold mb-2"
            >
              Entrada-Precio
            </label>
            <EntradaPrecio turnos={turnos} setTurnos={setTurnos} />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Actualizar Cine
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
