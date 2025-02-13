import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EntradaPrecio = ({turnos, setTurnos}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [precio, setPrecio] = useState(0);

  const handleModify = (turno) => {
    setSelectedTurno(turno);
    setPrecio(turno.precio);
    setShowModal(true);
  };

  const handleSave = () => {
    setTurnos((prevTurnos) =>
      prevTurnos.map((turno) =>
        turno.id === selectedTurno.id ? { ...turno, precio } : turno
      )
    );
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

return (
    <div>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Turno</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                {turnos.map((turno) => (
                    <tr key={turno.id}>
                        <td>{turno.descripcion}</td>
                        <td>{turno.precio}</td>
                        <td>
                            <Button variant="light" className="border-gray-950" onClick={() => handleModify(turno)}>
                                Modificar
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <Modal show={showModal} onHide={handleCancel}>
            <Modal.Header closeButton>
                <Modal.Title className="text-gray-950">Modificar Precio</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-gray-950">
                <Form>
                    <Form.Group controlId="formTurno">
                        <Form.Label className="text-gray-950">Turno</Form.Label>
                        <Form.Control type="text" value={selectedTurno?.descripcion} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formPrecio">
                        <Form.Label className="text-gray-950">Precio</Form.Label>
                        <Form.Control
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={handleSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
);
};

export default EntradaPrecio;