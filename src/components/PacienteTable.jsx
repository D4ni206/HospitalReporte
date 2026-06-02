function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export default function PacienteTable({ pacientes }) {
  return (
    <div className="tabla-pacientes">
      <table className="pacientes-table">
        <thead>
          <tr>
            <th>id</th>
            <th>nombre</th>
            <th>apellido</th>
            <th>dni</th>
            <th>triaje</th>
            <th>descripcion</th>
            <th>usuarioId</th>
            <th>nombreperador</th>
            <th>fechaRegistro</th>
            <th>caracteristicas</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="10" className="empty-row">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
