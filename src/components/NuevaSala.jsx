import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function NuevaSala({
  show,
  onSave,
  onCancel,
  formats,
  roomNumber,
  selectedRoom,
}) {
  const [capacity, setCapacity] = useState("");
  const [format, setFormat] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedRoom) {
      setCapacity(selectedRoom.capacidad ||selectedRoom.capacity);
      setFormat(selectedRoom.formatoId ||selectedRoom.format);
    } else {
      setCapacity("");
      setFormat("");
    }
  }, [selectedRoom]);

  const handleSave = () => {
    const newErrors = {};

    if (!capacity) {
      newErrors.capacity = "La capacidad es requerida";
    }

    if (!format) {
      newErrors.format = "El formato es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ capacity, format });
    setCapacity("");
    setFormat("");
    setErrors({});
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title className="text-gray-950">{selectedRoom ? "Modificar Sala" : "Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRoomNumber">
            <Form.Label className="text-gray-950">Número de Sala</Form.Label>
            <Form.Control
              type="text"
              value={roomNumber}
              readOnly
              className="text-gray-950"
            />
          </Form.Group>
          <Form.Group controlId="formCapacity">
            <Form.Label className="text-gray-950">Capacidad</Form.Label>
            <Form.Control
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              isInvalid={!!errors.capacity}
              className="text-gray-950"
            />
            <Form.Control.Feedback type="invalid" className="text-gray-950">
              {errors.capacity}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFormat">
            <Form.Label className="text-gray-950">Formato</Form.Label>
            <Form.Control
              as="select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              isInvalid={!!errors.format}
              className="text-gray-950"
            >
              <option value="" className="text-gray-950">
                Seleccione un formato
              </option>
              {formats.map((format) => (
                <option key={format.id} value={format.id} className="text-gray-950">
                  {format.nombre}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid" className="text-gray-950">
              {errors.format}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleSave}
        >
          {selectedRoom ? "Guardar Cambios" : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
