import { useEffect } from "react";
import { supabase }
from "../../supabase/client";

export default function Dashboard(){

useEffect(()=>{

const probar=async()=>{

const {data,error}
=
await supabase
.from("pacientes")
.select("*");

console.log(
"Datos:",
data
);

console.log(
"Error:",
error
);

};

probar();

},[]);

return(

<h1>

Dashboard

</h1>

)

}