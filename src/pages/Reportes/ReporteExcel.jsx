import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../../supabase/client";

export default function ReporteExcel(){

const generarExcel=async()=>{

const {data,error}=await supabase
.from("pacientes")
.select("*");

if(error) return console.log(error);

const hoja=
XLSX.utils.json_to_sheet(data);

const libro=
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
libro,
hoja,
"Pacientes"
);

const excel=
XLSX.write(
libro,
{
bookType:"xlsx",
type:"array"
}
);

saveAs(
new Blob([excel]),
"pacientes.xlsx"
);

};

return(

<button onClick={generarExcel}>
Descargar Excel
</button>

)

}