import supabase from "./supab_publico.js";
document.getElementById("boton_google").addEventListener("click",async () => {
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