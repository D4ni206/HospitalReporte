import React from "react";

import { useNavigate }
from "react-router-dom";

import { useAuth }
from "../../context/AuthContext";

import "./dashboard.css";


export default function Dashboard(){

const navigate=
useNavigate();


const {

usuario

}

=

useAuth();



const carpas=[

{

nombre:"CarpaA",

tipo:"Heridas leves",

pacientes:8,

limite:500

},

{

nombre:"CarpaB",

tipo:"Cirugía",

pacientes:15,

limite:500

},

{

nombre:"CarpaC",

tipo:"Críticos",

pacientes:5,

limite:500

},

{

nombre:"CarpaD",

tipo:"Observación",

pacientes:2,

limite:500

}

]



return(

<div className="dashboard">



<div className="sidebar">


<h1>

HospitalApp

</h1>




<div className="menu">


<button>

🏠 Inicio

</button>



<button>

🩺 Registrar Paciente

</button>



<button>

📋 Lista Pacientes

</button>



<button>

🔍 Consulta / Filtro

</button>



<button>

📄 Reporte PDF

</button>



<button>

📊 Reporte Excel

</button>



<button>

🚪 Cerrar sesión

</button>



</div>




<div className="perfil">


<div className="avatar">


</div>



<div className="datos">


<p>

user:
{usuario.nombre}

</p>



<p>

Rol:
{usuario.rol}

</p>



<p>

Área:
{usuario.carpa}

</p>



</div>



</div>



</div>






<div className="content">



<div className="top">


<h1>

🏥 Dashboard

</h1>



<h2>

Usuario:

{usuario.nombre}

</h2>



</div>





<div className="cards">


{

usuario.rol==="admin"

?

carpas.map(

(

c,

i

)=>(

<div

key={i}

className="card"

>


<h2>

{c.nombre}

</h2>



<p>

{c.tipo}

</p>



<p>

{c.pacientes}

/

{c.limite}

</p>



</div>

)

)


:


<div className="card">


<h2>

{usuario.carpa}

</h2>



<p>

Heridas leves

</p>



<p>

8/500

</p>



</div>



}



</div>



</div>



</div>

)

}