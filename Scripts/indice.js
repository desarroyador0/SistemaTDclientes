import supabase from "./supab_publico";

window.onload = () =>{
    const user = supabase.auth.getUser().then(async ({data: {user}}) => {
        if (user) {
            const { data, error } = await supabase


            const datos = data ?? [];
            if (error) {
                alert("Error al obtener los datos del usuario: " + error.message);
                return;
            }
            else{
                //wip
                return
            }
        } else {
            localStorage.clear();
            sessionStorage.clear();
            return window.location.href = "/Templates/Inicio/inicio_indice.html";
        }
    });
}