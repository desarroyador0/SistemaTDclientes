import supabase from "./supab_publico.js";
window.onload = () =>{
    const user = supabase.auth.getUser().then(async ({data: {user}}) => {
        if (user) {
            const id_usu = user.id;
            const { data, error } = await supabase
            .from('Cliente')
            .select('*')
            .eq('ID_Cliente', id_usu)
            .maybeSingle();

            if (error) {
                alert("Error al obtener los datos del usuario: " + error.message);
                return;
            }

            if (!data) {
                sessionStorage.setItem("id_cliente_temp", id_usu);
                sessionStorage.setItem("nombre_cliente_temp", user.user_metadata.full_name);
                return window.location.href = "/Plantillas/Signup/Cargar_datos_nuevo_usuario.html";
            }
            else{
                sessionStorage.clear();
                localStorage.setItem("id_cliente", data.ID_Cliente);
                localStorage.setItem("nombre_cliente", data.Nombre);
                localStorage.setItem("telefono_cliente", data.Telef);
                localStorage.setItem("ubicacion_cliente", data.Ubicacion_cliente);
                localStorage.setItem("fecha_union_cliente", data.F_creacion);
                return window.location.href = "/Plantillas/Dashboard_SPA.html";
            }
            
        } else {
            return window.location.href = "/Plantillas/Signup/Login_google.html";
        }
    });
}