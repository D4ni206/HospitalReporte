import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../supabase/client";

export default function ReportePDF(){

const generarPDF = async ()=>{

const {data,error}=await supabase
.from("pacientes")
.select("*");

if(error) return console.log(error);

const doc=new jsPDF();

doc.text("Reporte Pacientes",20,20);

autoTable(doc,{
head:[[
"ID",
"Nombre",
"Edad",
"Diagnóstico"
]],

body:data.map(p=>[
p.id,
p.nombre,
p.edad,
p.diagnostico
])

});

doc.save("pacientes.pdf");

}

return(

<button onClick={generarPDF}>
Descargar PDF
</button>

)

}