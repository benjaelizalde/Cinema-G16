"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, FormControl, InputGroup, Spinner } from "react-bootstrap";

export default function Cines() {
  const [cines, setCines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCines = async () => {
      try {
        const response = await fetch("/api/cines");
        const data = await response.json();
        setCines(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los cines:", error);
      }
    };

    fetchCines();
  }, []);

  const filteredCines = cines.filter((cine) =>
    cine.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cine?")) {
      try {
        await fetch(`/api/cines/${id}`, {
          method: "DELETE",
        });
        setCines(cines.filter((cine) => cine.id !== id));
      } catch (error) {
        console.error("Error al eliminar el cine:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando cines...</span>
        </Spinner>
        <h2 className="ml-3">Cargando cines...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h1 className="display-4 py-2">Cines</h1>
        <hr />
        <div className="d-flex justify-content-between mb-4 py-4">
          <InputGroup className="w-50">
            <FormControl
              placeholder="Buscar cine por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Link href="/new">
            <Button variant="primary">Nuevo Cine</Button>
          </Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Localidad</th>
              <th scope="col">Calle</th>
              <th scope="col">Número</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredCines.map((cine) => (
              <tr key={cine.id}>
                <td>{cine.nombre}</td>
                <td>{cine.direccion[0]?.localidad.nombre}</td>
                <td>{cine.direccion[0]?.calle}</td>
                <td>{cine.direccion[0]?.numero}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link href={`/cines/${cine.id}`}>
                      <Button variant="light" className="border-gray-950">Modificar</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(cine.id)}
                    >
                      Eliminar
                    </Button>
                    <Link href={`/cines/${cine.id}/salas`}>
                      <Button variant="dark">Ver Salas</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
