function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function PacienteTable({ pacientes, onEdit, onDelete, onInforme }) {
  return (
    <div className="tabla-pacientes">
      <table className="pacientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Triaje</th>
            <th>Descripción</th>
            <th>Usuario ID</th>
            <th>Nombre operador</th>
            <th>Fecha registro</th>
            <th>Características</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="11" className="empty-row">
                No hay pacientes registrados.
              </td>
            </tr>
          ) : (
            pacientes.map((paciente) => (
              <tr key={paciente.id ?? paciente.dni ?? paciente.nombre}>
                <td>{paciente.id}</td>
                <td>{paciente.nombre}</td>
                <td>{paciente.apellido}</td>
                <td>{paciente.dni}</td>
                <td>{paciente.triaje}</td>
                <td>{paciente.descripcion}</td>
                <td>{paciente.usuarioId}</td>
                <td>{paciente.nombreperador}</td>
                <td>{formatDate(paciente.fechaRegistro)}</td>
                <td>{paciente.caracteristicas}</td>
                <td className="action-cell">
                  <div className="action-buttons">
                    <button type="button" className="button-edit" onClick={() => onEdit?.(paciente.id)}>
                      Editar
                    </button>
                    <button type="button" className="button-delete" onClick={() => onDelete?.(paciente.id)}>
                      Eliminar
                    </button>
                    <button type="button" className="button-report" onClick={() => onInforme?.(paciente.id)}>
                      Informe
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
