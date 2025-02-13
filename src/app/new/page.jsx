"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NuevaSala from "@/components/NuevaSala";
import Salas from "@/components/Salas";
import { Button, Spinner, Alert } from "react-bootstrap";
import EntradaPrecio from "@/components/EntradaPrecio";

export default function NewCine() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener localidades desde el servidor
    fetch("/api/localidades")
      .then((res) => res.json())
      .then((data) => setLocalidades(data))
      .catch((error) =>
        console.error("Error al obtener las localidades:", error)
      );

    // Obtener formatos desde el servidor
    fetch("/api/formatos")
      .then((res) => res.json())
      .then((data) => setFormats(data))
      .catch((error) => console.error("Error al obtener los formatos:", error));

    // Obtener turnos desde el servidor
    fetch("/api/turnos")
      .then((res) => res.json())
      .then((data) => {
        const turnosConPrecio = data.map((turno) => ({
          ...turno,
          precio: 0,
        }));
        setTurnos(turnosConPrecio);
      })
      .catch((error) => console.error("Error al obtener los turnos:", error));
  }, []);

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

  const handleNewRoom = () => {
    // Calcular el primer número de sala que no exista en el array
    const existingNumbers = rooms.map((room) => room.number);
    let newRoomNumber = 1;
    while (existingNumbers.includes(newRoomNumber)) {
      newRoomNumber++;
    }
    setRoomNumber(newRoomNumber);
    setSelectedRoom(null);
    setShowModal(true);
  };

  const handleSaveRoom = ({ capacity, format }) => {
    if (selectedRoom) {
      // Modificar sala existente
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.number === selectedRoom.number
            ? { ...room, capacity, format }
            : room
        )
      );
    } else {
      // Crear nueva sala
      const newRoom = {
        number: roomNumber,
        capacity,
        format,
      };
      setRooms((prevRooms) =>
        [...prevRooms, newRoom].sort((a, b) => a.number - b.number)
      );
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleModifyRoom = (room) => {
    setRoomNumber(room.number);
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleDeleteRoom = (roomNumber) => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.number !== roomNumber)
    );
  };

  const handleCreateCine = async (e) => {
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
      // Guardar cine
      const cineResponse = await fetch("/api/cines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });
      const cineData = await cineResponse.json();

      // Guardar dirección
      const selectedLocalidadObj = localidades.find(
        (localidad) => localidad.nombre === selectedLocalidad
      );

      if (!selectedLocalidadObj) {
        throw new Error("Localidad no encontrada");
      }

      const direccionResponse = await fetch(
        `/api/cines/${cineData.id}/direccion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calle,
            numero,
            localidadId: selectedLocalidadObj.id,
          }),
        }
      );
      await direccionResponse.json();

      // Guardar salas
      for (const room of rooms) {
        await fetch(`/api/cines/${cineData.id}/salas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numero: room.number,
            capacidad: room.capacity,
            formatoId: room.format,
          }),
        });
      }

      // Guardar precios de entrada
      for (const turno of turnos) {
        await fetch(`/api/cines/${cineData.id}/entradaPrecio`, {
          method: "POST",
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
      console.error("Error al crear el cine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center pt-16">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner animation="border" role="status">
            <span className="sr-only">Creando cine...</span>
          </Spinner>
          <h2 className="ml-3">Creando cine...</h2>
        </div>
      ) : (
        <form
          className="bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-2xl"
          onSubmit={handleCreateCine}
        >
          <h1 className="text-center font-extrabold text-2xl py-2">Nuevo Cine</h1>
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
          <div className="mb-4 flex items-center justify-between">
            <label
              htmlFor="salas"
              className="block text-white-700 text-lg font-extrabold mb-2"
            >
              Salas
            </label>
            <Button variant="primary" onClick={handleNewRoom}>
              Nueva Sala
            </Button>
          </div>
          <Salas
            rooms={rooms}
            onModify={handleModifyRoom}
            onDelete={handleDeleteRoom}
            formats={formats}
          />
          <NuevaSala
            show={showModal}
            onSave={handleSaveRoom}
            onCancel={handleCancel}
            formats={formats}
            roomNumber={roomNumber}
            selectedRoom={selectedRoom}
          />
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
              Crear Cine
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
