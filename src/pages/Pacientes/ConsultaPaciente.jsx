import { useState } from "react";
import { supabase }
from "../../supabase/client";

export default function ConsultaPaciente(){

const [dni,setDni]=
useState("");

const [paciente,setPaciente]=
useState(null);


const buscar=
async()=>{

const {data,error}

=

await supabase

.from("pacientes")

.select("*")

.eq(
"dni",
dni
)

.single();


if(error){

alert(
"Paciente no registrado"
);

return;

}


setPaciente(
data
);

};


return(

<div className="card">

<h1>

Consulta Paciente

</h1>


<input

placeholder=
"Ingrese DNI"

value=
{dni}

onChange={
(e)=>

setDni(
e.target.value
)

}

/>



<button
onClick={buscar}
>

Consultar

</button>



{

paciente && (

<div
style={{
marginTop:"30px"
}}
>

<h2>

{paciente.nombre}

</h2>


<p>

Estado:

{paciente.estado}

</p>


<p>

Condición:

{paciente.condicion}

</p>


<p>

Características:

{paciente.caracteristicas}

</p>


<p>

Ubicación:

{paciente.carpa}

</p>

</div>

)

}


</div>

)

}