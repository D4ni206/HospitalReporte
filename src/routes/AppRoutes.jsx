import { Routes, Route }
from "react-router-dom";

import Login from "../pages/Login/Login";

import DashboardLayout
from "../layouts/DashboardLayout";

import Dashboard
from "../pages/Dashboard/Dashboard";

import RegistrarPaciente
from "../pages/Pacientes/RegistrarPaciente";

import ListaPacientes
from "../pages/Pacientes/ListaPacientes";

import NuevoOperador
from "../pages/Usuarios/NuevoOperador";

export default function AppRoutes(){

return(
    

<Routes>

<Route
path="/"
element={<Login/>}
/>
<Route
element={<DashboardLayout/>}
>

<Route
path="/dashboard"
element={<Dashboard/>}
/>


<Route
path="/registrar"
element={<RegistrarPaciente/>}
/>


<Route
path="/nuevo-operador"
element={<NuevoOperador/>}
/>

<Route
path="/pacientes"
element={<ListaPacientes/>}
/>

</Route>

</Routes>

)

}