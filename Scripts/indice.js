import supabase from "./supab_publico.js";

window.addEventListener('load', () => {
    supabase.auth.getUser().then(async ({data: {user}}) => {
        if (user) {
            const id_usu = user.id;
            const { data, error } = await supabase
            .from('Cliente')
            .select('*')
            .eq('ID_Cliente', id_usu)
            .maybeSingle();
            if (error) {
                alert("Error al obtener datos del usuario: " + error.message);
                return;
            }

            if (!data) {
                const telef = await registerPhoneIfMissing();
                if (telef === null) {
                    alert('Registro cancelado. Se requiere teléfono para crear el usuario.');
                    return;
                }

                const nombre = user?.user_metadata?.full_name || user?.user_metadata?.fullName || user?.metadata?.full_name || user?.full_name || 'Sin nombre';

                const resp = await fetch('/registrar_nuevo_usuario', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_cliente: user.id,
                        nombre_cliente: nombre,
                        telefono_cliente: telef
                    })
                });

                const result = await resp.json().catch(()=>({}));
                if (!resp.ok) throw new Error(result.error || 'No se pudo registrar el usuario');

                localStorage.setItem('telefono_cliente', telef);
                localStorage.setItem('id_cliente', user.id);
                localStorage.setItem('nombre_cliente', nombre);

                return window.location.href = "/Plantillas/Dashboard_SPA.html";
            }
            else{
                sessionStorage.clear();
                localStorage.setItem("id_cliente", data.ID_Cliente);
                localStorage.setItem("nombre_cliente", data.Nombre);
                localStorage.setItem("telefono_cliente", data.Telef);
                localStorage.setItem("fecha_union_cliente", data.F_creacion);
                return window.location.href = "/Plantillas/Dashboard_SPA.html";
            }
            
        } else {
            return;
        }
    });
});


async function registerPhoneIfMissing(){
    const input = prompt("Por favor, introduce tu teléfono (solo números):");
    if (input === null) return null; // usuario canceló
    const telefono = input.trim();
    if (/^[0-9+\- ]{6,20}$/.test(telefono)) return telefono;
    alert('Número no válido. Introduce entre 6 y 20 caracteres numéricos, + o - permitidos.');
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