import { Routes, Route }
from "react-router-dom";

import Login from "../pages/Login/Login";

import DashboardLayout
from "../layouts/DashboardLayout";

import ConsultaPaciente
from "../pages/Pacientes/ConsultaPaciente";

import Dashboard
from "../pages/Dashboard/Dashboard";

import RegistrarPaciente
from "../pages/Pacientes/RegistrarPaciente";

import ListaPacientes
from "../pages/Pacientes/ListaPacientes";

import ReportePDF
from "../pages/Reportes/ReportePDF";

import ReporteExcel
from "../pages/Reportes/ReporteExcel";


export default function AppRoutes(){

return(
    

<Routes>

<Route
path="/"
element={<Login/>}
/>
<Route

path="/consulta"

element={
<ConsultaPaciente/>
}

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
path="/pacientes"
element={<ListaPacientes/>}
/>


<Route
path="/pdf"
element={<ReportePDF/>}
/>


<Route
path="/excel"
element={<ReporteExcel/>}
/>

</Route>

</Routes>

)

}