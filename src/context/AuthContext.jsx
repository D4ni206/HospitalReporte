import React,{
createContext,
useContext,
useState
}
from "react";


const AuthContext =
createContext();



export function AuthProvider({ children }){


const [

usuario,

setUsuario

]

=

useState({

nombre:"Juan Perez",

rol:"operador",

carpa:"CarpaA"

});



return(

<AuthContext.Provider

value={{

usuario,

setUsuario

}}

>

{children}

</AuthContext.Provider>

)

}



export function useAuth(){

return useContext(
AuthContext
);

}