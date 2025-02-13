"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button, FormControl, InputGroup, Spinner } from "react-bootstrap";
import NuevaSala from "@/components/NuevaSala";

export default function SalasPage() {
  const { id } = useParams();
  const [cine, setCine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [formats, setFormats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCine = async () => {
        try {
          const response = await fetch(`/api/cines/${id}/salas`);
          const data = await response.json();
          setCine(data);
          // Ordenar las salas por número
          const sortedRooms = data.salas.sort((a, b) => a.numero - b.numero);
          setRooms(sortedRooms);
          setLoading(false);
        } catch (error) {
          console.error("Error al obtener los datos del cine:", error);
        }
      };

      fetchCine();
    }
  }, [id]);

  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await fetch("/api/formatos");
        const data = await response.json();
        setFormats(data);
      } catch (error) {
        console.error("Error al obtener los formatos:", error);
      }
    };

    fetchFormats();
  }, []);

  const getFormatName = (formatId) => {
    const format = formats.find((f) => f.id == parseInt(formatId));
    return format ? format.nombre : "Desconocido";
  };

  const handleNewRoom = async () => {
    // Obtener las salas desde la base de datos
    const response = await fetch(`/api/cines/${id}/salas`);
    const data = await response.json();
    const existingNumbers = data.salas.map((room) => room.numero);
    let newRoomNumber = 1;
    while (existingNumbers.includes(newRoomNumber)) {
      newRoomNumber++;
    }
    setRoomNumber(newRoomNumber);
    setSelectedRoom(null);
    setShowModal(true);
  };

  const handleSaveRoom = async ({ capacity, format }) => {
    try {
      const method = selectedRoom ? "PUT" : "POST";
      const url = selectedRoom
        ? `/api/salas/${selectedRoom.id}`
        : `/api/cines/${id}/salas`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero: roomNumber,
          capacidad: capacity,
          formatoId: format,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Error al ${selectedRoom ? "modificar" : "crear"} la sala`);
      }

      const newSala = await response.json();

      // Actualizar la lista de salas
      setRooms((prevRooms) => {
        if (selectedRoom) {
          return prevRooms.map((room) =>
            room.id === newSala.id ? newSala : room
          );
        } else {
          return [...prevRooms, newSala].sort((a, b) => a.numero - b.numero);
        }
      });
      setShowModal(false);
    } catch (error) {
      console.error(`Error al ${selectedRoom ? "modificar" : "crear"} la sala:`, error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleModifyRoom = (room) => {
    setRoomNumber(room.numero);
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleDeleteRoom = async (salaId) => {
    try {
      const response = await fetch(`/api/salas/${salaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Error al eliminar la sala");
      }

      // Actualizar la lista de salas
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== salaId)
      );
    } catch (error) {
      console.error("Error al eliminar la sala:", error);
    }
  };

  const filteredSalas = rooms.filter((sala) =>
    sala.numero.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando salas...</span>
        </Spinner>
        <h2 className="ml-3">Cargando salas...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4 py-2">Salas de {cine?.nombre}</h1>
      <hr />
      <div className="d-flex justify-content-between mb-4 py-4">
        <InputGroup className="w-50">
          <FormControl
            placeholder="Buscar sala por número"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={handleNewRoom}>
          Nueva Sala
        </Button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Número</th>
            <th scope="col">Capacidad</th>
            <th scope="col">Formato</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalas?.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.numero}</td>
              <td>{sala.capacidad}</td>
              <td>{getFormatName(sala.formatoId)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="light"
                    onClick={() => handleModifyRoom(sala)}
                    className="border-gray-950"
                  >
                    Modificar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRoom(sala.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NuevaSala
        show={showModal}
        onSave={handleSaveRoom}
        onCancel={handleCancel}
        formats={formats}
        roomNumber={roomNumber} // Pasar el número de sala al modal
        selectedRoom={selectedRoom}
      />
    </div>
  );
}
