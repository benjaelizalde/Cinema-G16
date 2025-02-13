import { Button } from "react-bootstrap";

const Salas = ({ rooms, onModify, onDelete, formats }) => {
    const getFormatName = (formatId) => {
        const format = formats.find((f) => f.id == parseInt(formatId));
        return format ? format.nombre : "Desconocido";
    };
return (
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
            {rooms.map((room, index) => (
                <tr key={index} className="align-middle">
                    <th scope="row">{room.number}</th>
                    <td>{room.capacity}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{getFormatName(room.format)}</td>
                    <td>
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="light" onClick={() => onModify(room)}>
                                Modificar
                            </Button>
                            <Button variant="danger" onClick={() => onDelete(room.number)}>
                                Eliminar
                            </Button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);
};

export default Salas;
