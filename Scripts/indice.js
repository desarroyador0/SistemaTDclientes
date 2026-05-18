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
            return;
        }
    });
}

document.getElementById("signInBtn").addEventListener("click",async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "/"}
    });

    if (error) {
        alert("Error al iniciar sesión con Google: " + error.message);
        return;
    }
    if (data?.url) {
        window.location.href = data.url;
    } else {
        alert("Error al iniciar sesión con Google: oauth_url_generation_failed");
    }
});

window.onload = () =>{
    supabase.auth.getSession().then(({data: {session}}) => {
        if (session) {
            window.location.href = "/";
        }
    });
}